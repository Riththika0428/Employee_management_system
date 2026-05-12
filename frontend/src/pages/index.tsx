import { GetServerSideProps } from "next";

// Server-side redirect from / to /dashboard
export default function Home() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/dashboard",
      permanent: false,
    },
  };
};
