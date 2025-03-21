# core/gpt_processor.py
import logging
from openai import OpenAI
from .utils.utils import chunk_text
import requests
from typing import Dict, Any
import json


def gpt_request(prompt: str, api_key: str, model: str = "gpt-3.5-turbo") -> str:
    """Effectue une requête à l'API GPT."""
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }
    
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=data
        )
        response.raise_for_status()
        
        result = response.json()
        return result["choices"][0]["message"]["content"].strip()
    
    except Exception as e:
        logging.error(f"Erreur lors de la requête GPT: {str(e)}")
        raise


def summarize_text(
    text: str,
    api_key: str,
    gpt_model: str = "gpt-3.5-turbo",
    temperature: float = 0.7,
    style: str = "bullet"
) -> str:
    """
    Résume un texte via GPT, avec support du 'style' (bullet, concise, detailed).
    Gère le 'chunking' si le texte est trop long.
    """
    if not text:
        return "Erreur: Le texte à résumer est vide."

    chunks = chunk_text(text, max_chars=2500)
    partial_summaries = []

    for chunk in chunks:
        if style == "bullet":
            user_prompt = (
                "Résume le texte suivant de manière concise, sous forme de liste à puces :\n\n"
                f"{chunk}"
            )
        elif style == "concise":
            user_prompt = (
                "Fais un résumé très concis (quelques phrases seulement) du texte suivant :\n\n"
                f"{chunk}"
            )
        else:  # "detailed"
            user_prompt = (
                "Voici le prompt utilisateur:"f"{style},{chunk}"
            )

        part_summary = gpt_request(user_prompt, api_key, model=gpt_model, temperature=temperature)
        partial_summaries.append(part_summary)

    if len(partial_summaries) == 1:
        return partial_summaries[0]
    else:
        combined_text = "\n\n".join(partial_summaries)
        combine_prompt = (
            "Voici plusieurs résumés partiels. Combine-les en un seul résumé "
            f"({style} si possible) :\n\n{combined_text}"
        )
        return gpt_request(combine_prompt, api_key, model=gpt_model, temperature=temperature)


def extract_keywords(text: str, api_key: str) -> str:
    """Extrait les mots-clés d'un texte en utilisant GPT."""
    if not text:
        raise ValueError("Le texte ne peut pas être vide")
    
    prompt = f"""
    Extrayez les mots-clés principaux du texte suivant, séparés par des virgules :

    {text}
    """
    
    try:
        return gpt_request(prompt, api_key)
    except Exception as e:
        logging.error(f"Erreur lors de l'extraction des mots-clés: {str(e)}")
        raise


def ask_question_about_text(text: str, question: str, api_key: str, model: str = "gpt-3.5-turbo") -> str:
    """
    Pose une question (Q/R) sur le texte transcrit et renvoie la réponse via GPT.
    """
    if not text:
        return "Erreur: Le texte est vide, impossible de répondre."
    if not question.strip():
        return "Erreur: La question est vide."

    prompt = (
        f"Voici un texte :\n\n{text}\n\n"
        f"Question : {question}\n\n"
        "Réponds de manière concise et précise, en te basant uniquement sur le texte."
    )
    return gpt_request(prompt, api_key, model=model)
