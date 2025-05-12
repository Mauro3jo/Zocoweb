import amexImg from "../assets/img/amex-blanco.png";
import argencardImg from "../assets/img/argencard-blanco.png";
import cabalImg from "../assets/img/cabal-blanco.png";
import dinersImg from "../assets/img/diners-blanco.png";
import masterImg from "../assets/img/mastercard-blanco.png";
import naranjaxImg from "../assets/img/naranjax-blanco.png";
import visaImg from "../assets/img/visa-blanco.png";

const TarjetasLogo = ({ tarjetasOrdenadas }) => {
  const imagenes = {
    Visa: visaImg,
    MasterCard: masterImg,
    Argencard: argencardImg,
    Amex: amexImg,
    Diners: dinersImg,
    Cabal: cabalImg,
    Naranjax: naranjaxImg,
  };

  return (
    <div className="">
      <div className="d-flex justify-content-around">
        {tarjetasOrdenadas.map((tarjeta, index) => (
          <article key={index} className="">
            <img
              className="img-tarjeta"
              src={imagenes[tarjeta]}
              alt={tarjeta}
            />
          </article>
        ))}
      </div>
    </div>
  );
};

export default TarjetasLogo;
