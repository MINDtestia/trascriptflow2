"""Configuration de la base de données."""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from ....backend.config.settings import DATABASE_URL

# Création du moteur de base de données
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# Création de la session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Création de la base pour les modèles
Base = declarative_base()

def get_db():
    """Générateur de session de base de données."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def setup_database(app):
    """Configure la base de données pour l'application."""
    from ...models import user, transcription, api_key  # noqa
    
    # Création des tables
    Base.metadata.create_all(bind=engine) 