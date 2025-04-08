// Utilitaire pour la navigation
import { useLocation } from 'wouter';

/**
 * Navigue vers une route spécifiée
 * Cette fonction est utilisée à la place de window.location.href pour
 * éviter les problèmes de rechargement complet de la page
 * 
 * @param path Chemin vers lequel naviguer
 */
export function navigateTo(path: string): void {
  // Utilisons l'API History pour une navigation sans rechargement
  window.history.pushState({}, '', path);
  // Déclencher un événement pour informer l'application du changement d'URL
  window.dispatchEvent(new Event('popstate'));
}

/**
 * Hook utilitaire pour la navigation
 * Permet d'utiliser navigateTo dans des composants fonctionnels
 */
export function useNavigation() {
  const [, navigate] = useLocation();
  
  return {
    navigateTo: (path: string) => {
      navigate(path);
    }
  };
}