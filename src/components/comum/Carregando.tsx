import s from "./Carregando.module.css";

/** Os dados vivem no navegador: no servidor e durante a hidratação, só o espaço reservado. */
export function Carregando() {
  return (
    <div className={`conteiner ${s.carregando}`} aria-busy="true">
      <span className="sr-only">Carregando seus dados</span>
    </div>
  );
}
