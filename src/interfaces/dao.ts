interface DAO {
  name: string;
  address: string;
  purpose?: string;
  logo?: string;
  funds: string;
  members: number | null;
  totalProposals: number | null;
  links?: Record<string, string>;
  totalPms: number | null;
  // proposal id to pm id
  proposalPms: Record<number, number>;
}

export default DAO;
