using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostulantesController : ControllerBase
    {
        private readonly ITokenPostulanteService _tokenPostulanteService;
        private readonly ITokenService _tokenService;
        private readonly IPostulantesService _postulantesService;
        private readonly IUsuarioZocoService _usuarioZocoService;
        private readonly ICargosAnteriores _cargosanteriores;
        private readonly IReferenciaService _referenciaService;
        private readonly IAptitudService _aptitudService;
        private readonly IEducacionService _educacionService;
        public PostulantesController(ITokenService tokenService, IMapper mapper, IUsuarioZocoService usuarioZocoService, ITokenPostulanteService tokenPostulanteService, IPostulantesService postulantesService
            , ICargosAnteriores cargosAnteriores, IReferenciaService referenciaService, IAptitudService aptitudService, IEducacionService educacionService)
        {
            _tokenPostulanteService = tokenPostulanteService;
            _tokenService = tokenService;
            _postulantesService = postulantesService;
            _cargosanteriores = cargosAnteriores;
            _referenciaService = referenciaService;
            _aptitudService = aptitudService;
            _educacionService = educacionService;
        }
        [HttpPost("crearpostulante")]
        public async Task<IActionResult> CrearPostulante([FromBody] VMPostulante request)
        {
            if (request == null)
                return BadRequest(new { message = "Datos inválidos" });

            try
            {
                // Convertir de VMPostulante a Postulante
                Postulante nuevoPostulante = new Postulante
                {
                    Nombre = request.Nombre ?? "",
                    Correo = request.Correo ?? "",
                    Telefono = request.Telefono,
                    FechaCreacion = string.IsNullOrEmpty(request.FechaCreacion)
                                    ? null
                                    : DateTime.Parse(request.FechaCreacion),
                    Cv = string.IsNullOrEmpty(request.Cv)
                        ? null
                        : Convert.FromBase64String(request.Cv),
                    Direccion = request.Direccion,
                    Contraseña = request.Contraseña,
                    Dni = request.Dni,
                    Estado = request.Estado?.ToLower() == "activo",
                    TipoUsuario = request.TipoUsuario,
                    Provincia = request.Provincia,
                    Localidad = request.Localidad
                };

                // Guardar el postulante en la base de datos
                Postulante postulanteCreado = await _postulantesService.Crear(nuevoPostulante);

                // ✅ Guardar Cargos Anteriores y Referencias
                if (request.CargosAnteriores != null && request.CargosAnteriores.Any())
                {
                    foreach (var cargoVM in request.CargosAnteriores)
                    {
                        CargosAnteriore nuevoCargo = new CargosAnteriore
                        {
                            IdPostulante = postulanteCreado.Id,
                            TipoEmpleo = cargoVM.TipoEmpleo,
                            Empresa = cargoVM.Empresa,
                            FechaInicio = cargoVM.FechaInicio,
                            FechaFin = cargoVM.FechaFin,
                            Ubicacion = cargoVM.Ubicacion,
                            Descripcion = cargoVM.Descripcion
                        };

                        var cargoCreado = await _cargosanteriores.Crear(nuevoCargo);

                        // ✅ Guardar Referencias asociadas al Cargo
                        if (cargoVM.Referencias != null && cargoVM.Referencias.Any())
                        {
                            foreach (var referenciaVM in cargoVM.Referencias)
                            {
                                Referencia nuevaReferencia = new Referencia
                                {
                                    IdEmpleo = cargoCreado.Id, // Relación con el Cargo
                                    Nombre = referenciaVM.Nombre,
                                    Cargo = referenciaVM.Cargo,
                                    Telefono = referenciaVM.Telefono,
                                    Mail = referenciaVM.Mail
                                };

                                await _referenciaService.Crear(nuevaReferencia);
                            }
                        }
                    }
                }

                // ✅ Guardar Educación y sus Aptitudes
                if (request.Educaciones != null && request.Educaciones.Any())
                {
                    foreach (var educacionVM in request.Educaciones)
                    {
                        Educacion nuevaEducacion = new Educacion
                        {
                            IdPostulante = postulanteCreado.Id,
                            IntitucionEducativa = educacionVM.Id ?? 0,
                            Titulo = educacionVM.Titulo,
                            DisciplinaAcademica = educacionVM.DisciplinaAcademica,
                            FechaInicio = educacionVM.FechaInicio,
                            FechaFin = educacionVM.FechaFin,
                            Descripcion = educacionVM.Descripcion
                        };

                        var educacionCreada = await _educacionService.Crear(nuevaEducacion);

                        // ✅ Guardar Aptitudes de la Educación
                        if (educacionVM.Aptitudes != null && educacionVM.Aptitudes.Any())
                        {
                            foreach (var aptitudVM in educacionVM.Aptitudes)
                            {
                                Aptitud nuevaAptitud = new Aptitud
                                {
                                    Aptitud1 = aptitudVM.Aptitud,
                                    IdPostulante = postulanteCreado.Id,
                                    IdEducacion = educacionCreada.IdEducacion
                                };

                                await _aptitudService.Crear(nuevaAptitud);
                            }
                        }
                    }
                }

                // ✅ Guardar Aptitudes Independientes (sin educación)
                if (request.Aptitudes != null && request.Aptitudes.Any())
                {
                    foreach (var aptitudVM in request.Aptitudes)
                    {
                        Aptitud nuevaAptitud = new Aptitud
                        {
                            Aptitud1 = aptitudVM.Aptitud,
                            IdPostulante = postulanteCreado.Id,
                            IdEducacion = null
                        };

                        await _aptitudService.Crear(nuevaAptitud);
                    }
                }

                return Ok(new { message = "Postulante creado con éxito", postulanteId = postulanteCreado.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error en el servidor", error = ex.Message });
            }
        }

    }
}

