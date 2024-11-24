export interface Setting {
  useJson: boolean;
  data: {
    JKF_URL: string;
    download: boolean;
    downloadPage: "All" | "all" | "ALL" | number;
    destination: string;
  }[];
}
