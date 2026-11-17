import Link from "next/link";
import s from "./not-found.module.css";

export default function NaoEncontrada() {
  return (
    <div className={`conteiner ${s.pagina}`}>
      <h1 className={s.titulo}>Esta página não existe</h1>
      <p className={s.texto}>
        O endereço pode ter sido digitado errado. Seus lançamentos continuam guardados neste navegador.
      </p>
      <Link href="/" className="botao botao-primario">
        Voltar para o resumo
      </Link>
    </div>
  );
}
