import { Lato } from "next/font/google";
import Container from "@/src/layout/container.layout";

const lato=Lato({subsets:["latin"],weight:["100","300","400","700","900"],variable:"--font-lato"})


export default function Home() {
  return (
    <main className={`${lato.className}`}>
      <Container.Page>
        <h1 className="">hello world!!</h1>
      </Container.Page>
    </main>
  );
}
