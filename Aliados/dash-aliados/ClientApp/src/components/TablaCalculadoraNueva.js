import React, { useContext } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';

const TablaCalculadoraNueva = () => {

    const { darkMode } = useContext(DarkModeContext);
    return (
        <section>
        <div
          className={
            darkMode
              ? " container table-responsive py-5 bg-tabla-calculadora-dark my-5"
              : "container table-responsive py-5 bg-tabla-calculadora my-5"
          }
        >
          <table className="table table-borderless responsive striped hover">
            <thead className="border-0 ">
              <tr className="text-center tabla-thead">
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-12 py-3 priority-1 "
                      : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3  priority-1"
                  }
                  scope="col "
                >
                 valor 1 
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 lato-regular fs-12 py-3  priority-2"
                      : "bg-dark text-white fs-12 lato-regular py-3   priority-2"
                  }
                  scope="col"
                >
                 valor 2
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 lato-regular fs-12 py-3 priority-3"
                      : "bg-dark text-white fs-12 lato-regular py-3  priority-3"
                  }
                  scope="col"
                >
                 valor 3
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 lato-regular fs-12 py-3  priority-4"
                      : "bg-dark text-white fs-12 lato-regular py-3  priority-4"
                  }
                  scope="col"
                >
                  valor 4
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 lato-regular fs-12 py-3 priority-5"
                      : "bg-dark text-white fs-12 lato-regular py-3  priority-5"
                  }
                  scope="col"
                >
                  valor 4
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 lato-regular fs-12 py-3 priority-6"
                      : "bg-dark text-white fs-12 lato-regular py-3 priority-6"
                  }
                  scope="col"
                >
                  valor 5
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 lato-regular fs-12 py-3 priority-7"
                      : "bg-dark text-white fs-12 lato-regular py-3 priority-7"
                  }
                  scope="col"
                >
                 valor 6
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 lato-regular fs-12 py-3 priority-8"
                      : "bg-dark text-white fs-12 lato-regular py-3  priority-8"
                  }
                  scope="col"
                >
                 valor 7
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 lato-regular fs-12 py-3 priority-9"
                      : "bg-dark text-white fs-12 lato-regular py-3 priority-9"
                  }
                  scope="col"
                >
                  valor 8
                </th>
                <th
                  className="bg-verde text-white lato-regular py-3 border-tabla-derecha"
                  scope="col"
                >
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              <tr
                className={
                  darkMode
                    ? " tabla-borde-bottom  text-white"
                    : "tabla-borde-bottom  text-dark"
                }
              >
                <td className="fs-12-a-10 lato-regular py-3 priority-1">
                  {" "}
                  1
                </td>
                <td className="fs-12-a-10 lato-regular py-3 priority-2">
                  $ 2
                </td>
                <td className="fs-12-a-10 lato-regular py-3 priority-3">
                  $ 3
                </td>
                <td className="fs-12-a-10 lato-regular py-3 priority-4">
                  $ 4
                </td>
                <td className="fs-12-a-10 lato-regular py-3 priority-5">
                  $ 5
                </td>
                <td className="fs-12-a-10 lato-regular py-3 priority-6">
                  $ 6
                </td>
                <td className="fs-12-a-10 lato-regular py-3 priority-7">
                  $ 7
                </td>
                <td className="fs-12-a-10 lato-regular py-3 priority-8">
                  $ 8
                </td>
                <td className="fs-12-a-10 lato-regular py-3 priority-9">
                  $ 9
                </td>
                <td className="fs-12-a-10 lato-regular py-3 priority-1">
                  $ 10
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    );
};

export default TablaCalculadoraNueva;