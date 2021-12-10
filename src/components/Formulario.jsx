import React, { useEffect } from "react";
import styled from "@emotion/styled";
import useMoneda from "../hooks/useMoneda";
import useCriptomoneda from "../hooks/useCriptomoneda";
import axios from "axios";
import { useState } from "react";
import Error from "./Error";

const Boton = styled.button`
  margin-top: 20px;
  font-weight: bold;
  font-size: 20px;
  padding: 10px;
  background-color: #66a2fe;
  border: none;
  width: 100%;
  border-radius: 10px;
  color: #fff;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #326ac0;
    cursor: pointer;
  }
`;

const Fomulario = ({ setMoneda, setCriptoMoneda }) => {
  //state del listado de criptomonedas
  const [listaCripto, setListaCripto] = useState([]);
  const [error, setError] = useState(false);

  const MONEDAS = [
    { codigo: "USD", nombre: "Dólar Estadounidense" },
    { codigo: "MXN", nombre: "Peso Mexicano" },
    { codigo: "EUR", nombre: "Euro" },
    { codigo: "GBP", nombre: "Libra Esterlina" },
    { codigo: "COP", nombre: "Peso Colombiano" },
  ];
  //utilizar useMoneda
  const [moneda, SelectMonedas] = useMoneda("Elije tu moneda", "", MONEDAS);

  //utilizar criptomoneda
  const [criptomoneda, SelectCripto] = useCriptomoneda(
    "Elige tu Criptomoneda",
    "",
    listaCripto
  );

  //Ejecutar llamado a la api
  useEffect(() => {
    const consultarAPI = async () => {
      const url =
        "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";
      const resultado = await axios.get(url);
      setListaCripto(resultado.data.Data);
    };
    consultarAPI();
  }, []);

  //cuando el usuario hace submit
  const cotizarMoneda = (e) => {
    e.preventDefault();

    //validar si ambos campos no estan vacios
    if (moneda === "" || criptomoneda === "") {
      setError(true);
      return;
    }

    //pasar los datos al componente principal
    setError(false);
    setMoneda(moneda);
    setCriptoMoneda(criptomoneda);
  };

  return (
    <form onSubmit={cotizarMoneda}>
      {error ? <Error mensaje="Todos los campos son obligatorios" /> : null}
      <SelectMonedas />
      <SelectCripto />
      <Boton type="submit">Calcular</Boton>
    </form>
  );
};

export default Fomulario;
