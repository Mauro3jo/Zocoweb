import amexImg from "../assets/img/amex.png";
import argencardImg from "../assets/img/argencard.png";
import cabalImg from "../assets/img/cabal.png";
import dinersImg from "../assets/img/diners.png";
import masterImg from "../assets/img/mastercard.png";
import naranjaxImg from "../assets/img/naranjax.png";
import visaImg from "../assets/img/visa.png";

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
          <img className="img-tarjeta" src={imagenes[tarjeta]} alt={tarjeta} />
        </article>
      ))}
    </div>
  </div>
  );
};

export default TarjetasLogo;