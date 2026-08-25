export type StatutDemande = 'EN_ATTENTE' | 'APPROUVEE' | 'REFUSEE' | 'ANNULEE';
export type PeriodeJournee = 'JOURNEE_COMPLETE' | 'MATIN' | 'APRES_MIDI';

export interface UserSummary {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  matricule: string;
}

export interface TypeConge {
  id: number;
  code: string;
  libelle: string;
  description?: string | null;
  quota_annuel_defaut: number;
  justificatif_requis: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SoldeConge {
  id: number;
  employe_id: number;
  type_conge_id: number;
  annee: number;
  jours_acquis: number;
  jours_pris: number;
  jours_en_attente: number;
  jours_restants: number;
  type_conge?: TypeConge | null;
  employe?: UserSummary | null;
  updated_at: string;
}

export interface DemandeConge {
  id: number;
  employe_id: number;
  type_conge_id: number;
  date_debut: string;
  date_fin: string;
  periode_debut: PeriodeJournee;
  periode_fin: PeriodeJournee;
  nombre_jours: number;
  motif?: string | null;
  justificatif_url?: string | null;
  statut: StatutDemande;
  decideur_id?: number | null;
  commentaire_decision?: string | null;
  date_decision?: string | null;
  created_at: string;
  employe?: UserSummary | null;
  decideur?: UserSummary | null;
  type_conge?: TypeConge | null;
}

export interface DemandeCongeCreate {
  type_conge_id: number;
  date_debut: string;
  date_fin: string;
  periode_debut?: PeriodeJournee;
  periode_fin?: PeriodeJournee;
  motif?: string;
  justificatif_url?: string;
}

export interface DemandeCongeDecision {
  decision: 'APPROUVEE' | 'REFUSEE';
  commentaire?: string;
}

export interface DashboardSummary {
  total_employes: number;
  demandes_en_attente: number;
  demandes_approuvees: number;
  demandes_refusees: number;
  jours_approuves: number;
  jours_en_attente: number;
  taux_acceptation: number | null;
}

export interface DashboardBreakdown {
  label: string;
  demandes: number;
  jours: number;
}

export interface DashboardMonthlyPoint {
  mois: string;
  demandes: number;
  jours: number;
}

export interface DashboardUpcomingAbsence {
  demande_id: number;
  employe: string;
  type_conge: string;
  date_debut: string;
  date_fin: string;
  nombre_jours: number;
  statut: StatutDemande;
}

export interface DashboardOverview {
  annee: number;
  role: string;
  summary: DashboardSummary;
  by_type: DashboardBreakdown[];
  monthly_evolution: DashboardMonthlyPoint[];
  upcoming_absences: DashboardUpcomingAbsence[];
}

export interface NotificationItem {
  id: number;
  destinataire_id: number;
  titre: string;
  message: string;
  lue: boolean;
  lien?: string | null;
  created_at: string;
}

export interface UserCreatePayload {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  matricule: string;
  departement: string;
  role: 'EMPLOYE' | 'MANAGER' | 'RH_ADMIN';
  manager_id?: number | null;
  is_active?: boolean;
}

export interface UserUpdatePayload {
  email?: string;
  nom?: string;
  prenom?: string;
  departement?: string;
  role?: 'EMPLOYE' | 'MANAGER' | 'RH_ADMIN';
  is_active?: boolean;
  manager_id?: number | null;
  password?: string;
}
