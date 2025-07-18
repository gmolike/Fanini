// apps/api/src/domain/repositories/IMemberRepository.ts
export interface IMemberRepository {
  findAll(filters?: {
    active?: boolean;
    search?: string;
    roleId?: string;
  }): Promise<any[]>;
  findById(id: string): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
  /**
   * Erstellt ein neues Mitglied
   * @param data - Die Mitgliedsdaten
   * @returns Das erstellte Mitglied
   */
  create(data: {
    user_id: string;
    vorname: string;
    nachname: string;
    email: string;
    telefon?: string;
    member_type: "easyverein" | "creator" | "sponsor" | "partner";
    mitglied_seit: Date;
    ist_aktiv: boolean;
  }): Promise<any>;

  /**
   * Erstellt ein Creator-Profil
   * @param data - Die Creator-Daten
   * @returns Das erstellte Profil
   */
  createCreatorProfile(data: {
    member_id: string;
    kuenstlername: string;
    portfolio_link?: string;
    ist_aktiv: boolean;
    aktiv_seit: Date;
  }): Promise<any>;
}
