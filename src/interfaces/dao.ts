interface DAO {
  name: string;
  address: string;
  purpose?: string;
  logo?: string;
  funds: string;
  members: number | null;
  totalProposals: number | null;
  links?: Record<string, string>;
}

export default DAO;
