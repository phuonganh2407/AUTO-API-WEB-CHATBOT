type Env = "dev" | "stag" | "prod";

interface Account {
  username: string;
  password: string;
  tenant: string;
  shopName: string;
}

export const accounts: Record<Env, Account> = {
  dev: {
    username: "0987162112",
    password: "123456789",
    tenant: "448216300912640",
    shopName: "Cua hang Panh Chi nhanh 1"
  },
  stag: {
    username: "0383513969",
    password: "123456789",
    tenant: "589719020044288",
    shopName: "Cua hang Panh Chi nhanh 1"
  },
  prod: {
    username: "0383513969",
    password: "Panh2407",
    tenant: "675064532107264",
    shopName: "Chi nhánh Panh 1"
  },
};
