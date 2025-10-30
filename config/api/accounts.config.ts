type Env = "dev" | "stag" | "prod";

interface Account {
  username: string;
  password: string;
  tenant: string;
  shopName: string;
  nameOwner: string;
}

export const accounts: Record<Env, Account> = {
  dev: {
    username: "0987162112",
    password: "123456789",
    tenant: "448216300912640",
    shopName: "Cua hang Panh Chi nhanh 1",
    nameOwner: "Nguyễn Thị Panh Panh"
  },
  stag: {
    username: "0383513969",
    password: "123456789",
    tenant: "849735742128128",
    shopName: "Panh stag",
    nameOwner: "Nguyễn Thị Panh"
  },
  prod: {
    username: "0383513969",
    password: "Panh2407",
    tenant: "675064532107264",
    shopName: "Chi nhánh Panh 1",
    nameOwner: "Nguyễn Phương Anh Update"
  },
};
