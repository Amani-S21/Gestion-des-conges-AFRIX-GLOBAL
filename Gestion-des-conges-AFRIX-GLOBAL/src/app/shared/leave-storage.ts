const LEAVE_REQUESTS_KEY = 'afrix-leave-requests';
const RETENTION_PERIOD_MS = 365 * 24 * 60 * 60 * 1000;

export interface StoredLeaveRequest {
  reference: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'En attente' | 'Validée' | 'Refusée';
  createdAt?: number;
}

// Supprime les demandes dont la date de création dépasse la période administrative d'un an.
export function loadActiveLeaveRequests(): StoredLeaveRequest[] {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  const savedRequests = localStorage.getItem(LEAVE_REQUESTS_KEY);
  if (!savedRequests) {
    return [];
  }

  try {
    const requests = JSON.parse(savedRequests) as StoredLeaveRequest[];
    const now = Date.now();
    const activeRequests = requests
      .map((request) => ({ ...request, createdAt: request.createdAt ?? now }))
      .filter((request) => now - request.createdAt! < RETENTION_PERIOD_MS);

    localStorage.setItem(LEAVE_REQUESTS_KEY, JSON.stringify(activeRequests));
    return activeRequests;
  } catch {
    return [];
  }
}

// Enregistre la liste après une création ou une décision de responsable.
export function saveLeaveRequests(requests: StoredLeaveRequest[]): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LEAVE_REQUESTS_KEY, JSON.stringify(requests));
  }
}

// Lance un nettoyage périodique tant que l'écran historique est ouvert.
export function startLeaveHistoryCleanup(onCleanup: (requests: StoredLeaveRequest[]) => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const cleanup = () => onCleanup(loadActiveLeaveRequests());
  const timer = window.setInterval(cleanup, 60 * 60 * 1000);
  return () => window.clearInterval(timer);
}
