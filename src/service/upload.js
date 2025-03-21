import axios from 'axios';
import config from '@/config';
import store from '@/store';
import websocketService from './websocket';

class UploadService {
  constructor() {
    this.activeUploads = new Map();
  }

  // Téléversement avec support de reprise et progression
  async uploadFile(file, endpoint, options = {}) {
    const uploadId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    
    // Validation du type de fichier
    const fileExt = file.name.split('.').pop().toLowerCase();
    const isValidType = this._validateFileType(file, options.fileTypes);
    
    if (!isValidType) {
      throw new Error(`Type de fichier non supporté: ${fileExt}`);
    }
    
    // Validation de la taille
    if (file.size > config.UPLOAD.MAX_FILE_SIZE) {
      throw new Error(`Fichier trop volumineux: ${(file.size / (1024 * 1024)).toFixed(2)}MB (max: ${config.UPLOAD.MAX_FILE_SIZE / (1024 * 1024)}MB)`);
    }
    
    // Création d'un objet de métadonnées pour suivre l'upload
    const uploadMeta = {
      id: uploadId,
      file,
      progress: 0,
      status: 'preparing',
      cancelTokenSource: axios.CancelToken.source()
    };
    
    this.activeUploads.set(uploadId, uploadMeta);
    
    try {
      // Notifier le store du début de l'upload
      store.commit('ADD_UPLOAD', {
        id: uploadId,
        filename: file.name,
        size: file.size,
        progress: 0,
        status: 'preparing'
      });
      
      // Préparer l'upload en informant le serveur
      const prepareResponse = await axios.post(`${config.API.BASE_URL}/${endpoint}/prepare`, {
        filename: file.name,
        filesize: file.size,
        filetype: file.type
      });
      
      const { uploadUrl, uploadFields } = prepareResponse.data;
      
      // Créer un FormData pour l'upload
      const formData = new FormData();
      
      // Ajouter les champs nécessaires pour un upload S3 si c'est le cas
      if (uploadFields) {
        Object.entries(uploadFields).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }
      
      // Ajouter le fichier lui-même
      formData.append('file', file);
      
      // Mettre à jour le statut
      uploadMeta.status = 'uploading';
      store.commit('UPDATE_UPLOAD', {
        id: uploadId,
        status: 'uploading'
      });
      
      // Effectuer l'upload avec suivi de progression
      const response = await axios.post(uploadUrl || `${config.API.BASE_URL}/${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          
          uploadMeta.progress = percentCompleted;
          
          store.commit('UPDATE_UPLOAD', {
            id: uploadId,
            progress: percentCompleted
          });
          
          // Écouter les événements WebSocket pour les mises à jour de traitement
          websocketService.subscribe(`${endpoint}_progress_${uploadId}`, (data) => {
            store.commit('UPDATE_UPLOAD', {
              id: uploadId,
              status: 'processing',
              progress: data.progress,
              message: data.message
            });
          });
        },
        cancelToken: uploadMeta.cancelTokenSource.token
      });
      
      // Upload terminé avec succès
      uploadMeta.status = 'completed';
      
      store.commit('UPDATE_UPLOAD', {
        id: uploadId,
        status: 'completed',
        progress: 100,
        result: response.data
      });
      
      return {
        id: uploadId,
        ...response.data
      };
      
    } catch (error) {
      // Gérer les erreurs d'upload
      if (axios.isCancel(error)) {
        uploadMeta.status = 'cancelled';
        store.commit('UPDATE_UPLOAD', {
          id: uploadId,
          status: 'cancelled'
        });
        throw new Error('Upload annulé');
      } else {
        uploadMeta.status = 'error';
        store.commit('UPDATE_UPLOAD', {
          id: uploadId,
          status: 'error',
          error: error.message
        });
        throw error;
      }
    } finally {
      // Nettoyage après un certain temps
      setTimeout(() => {
        this.activeUploads.delete(uploadId);
      }, 30000);
    }
  }

  cancelUpload(uploadId) {
    const upload = this.activeUploads.get(uploadId);
    if (upload && upload.status === 'uploading') {
      upload.cancelTokenSource.cancel('Upload annulé par l\'utilisateur');
      return true;
    }
    return false;
  }

  _validateFileType(file, allowedTypes) {
    if (!allowedTypes) {
      // Par défaut, utiliser les types autorisés dans la config
      const fileExt = file.name.split('.').pop().toLowerCase();
      return config.UPLOAD.ACCEPTED_AUDIO_FORMATS.includes(fileExt) || 
             config.UPLOAD.ACCEPTED_VIDEO_FORMATS.includes(fileExt);
    }
    
    return allowedTypes.some(type => {
      if (type.includes('/')) {
        // Vérification MIME type
        return file.type.match(new RegExp(type.replace('*', '.*')));
      } else {
        // Vérification extension
        const fileExt = file.name.split('.').pop().toLowerCase();
        return type.toLowerCase() === fileExt;
      }
    });
  }
}

export default new UploadService();