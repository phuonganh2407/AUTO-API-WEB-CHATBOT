type Env = "dev" | "stag" | "prod";

interface Account {
  username: string;
  password: string;
  client_id: string;
}

export const accounts: Record<Env, Account> = {
  dev: {
    username: "hiepnv_tmt30",
    password: "Hiep123456",
    client_id: "tmtWebApp"
  },
  stag: {
    username: "hiepnv_prod02",
    password: "Hiep123456",
    client_id: "tmtWebApp"
  },
  prod: {
    username: "hiepnv_prod02",
    password: "Hiep123456",
    client_id: "tmtWebApp"
  },
};
