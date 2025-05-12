using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Newtonsoft.Json;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Org.BouncyCastle.Asn1.Ocsp;
using DocumentFormat.OpenXml.Office2016.Excel;
using Entity.Zoco;
using BLL.ImplementacionZoco;
using Entity.VM;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccesoController : ControllerBase
    {
        private readonly IUsuarioZocoService _usuariosService;
        private readonly IUsuarioCajeroService _usuariosCajeroService;

        private readonly ITokenService _tokenService;
        private readonly ITokenCajeroService _tokencajeroservice;

        private readonly IMapper _mapper;
        private readonly string secretKey;

        private readonly IZocoConectService _conectService;
        private readonly IPostulantesService _postulantesService;
        private readonly ITokenPostulanteService _tokenpostulanteService;

        public AccesoController(IUsuarioZocoService usuariosService, ITokenCajeroService tokenCajeroService, IUsuarioCajeroService usuarioCajeroService,
            ITokenService tokenService, IMapper mapper, IConfiguration config, IZocoConectService zocoConectService,IPostulantesService postulantesService
            , ITokenPostulanteService tokenPostulanteService)
        {
            _usuariosService = usuariosService;
            _usuariosCajeroService = usuarioCajeroService;
            _tokencajeroservice = tokenCajeroService;
            _tokenService = tokenService; 
            _mapper = mapper;
            secretKey = config.GetSection("settings").GetSection("secretkey").ToString();
            _conectService = zocoConectService;
            _postulantesService = postulantesService;
            _tokenpostulanteService = tokenPostulanteService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<VMUsuariosZoco>> Login([FromBody] VMUsuariosZoco usuario)
        {
            var usuarioEncontrado = await _usuariosService.ObtenerPorCredenciales(usuario.Usuario, usuario.Password);
            UsuarioCajero usuarioCajeroencontrado = null;
            VMUsuarioConect vMUsuarioConect = null;
              Postulante vMPostulante = null;

            if (usuarioEncontrado == null)
            {
                usuarioCajeroencontrado = await _usuariosCajeroService.ObtenerPorCredenciales(usuario.Usuario, usuario.Password);

                if (usuarioCajeroencontrado == null)
                {
                    vMUsuarioConect = await _conectService.ObtenerPorCredencialesZocoConect(usuario.Usuario, usuario.Password);

                    if (vMUsuarioConect == null)
                    {
                        vMPostulante = await _postulantesService.ObtenerPorCredenciales(usuario.Usuario, usuario.Password);
                        if (vMPostulante == null)
                        {
                            return StatusCode(StatusCodes.Status401Unauthorized, new { mensaje = "Credenciales inválidas" });
                        }else if ((bool)!vMPostulante.Estado)
                        {
                            return StatusCode(StatusCodes.Status401Unauthorized, new { mensaje = "Cuenta desactivada" });

                        }
                    }
                    else if ((bool)!vMUsuarioConect.Estado)
                    {
                        return StatusCode(StatusCodes.Status401Unauthorized, new { mensaje = "Cuenta desactivada" });
                    }
                }
                else if ((bool)!usuarioCajeroencontrado.Estado)
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, new { mensaje = "Cuenta desactivada" });
                }
            }
            else if ((bool)!usuarioEncontrado.Estado)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new { mensaje = "Cuenta desactivada" });
            }
            var keyBytes = Encoding.ASCII.GetBytes(secretKey);
            var claims = new ClaimsIdentity();
            claims.AddClaim(new Claim(ClaimTypes.NameIdentifier, usuario.Usuario));

            // Usar TipoUsuario de usuarioCajeroencontrado si usuarioEncontrado es null
            var tipoUsuario = usuarioEncontrado?.TipoUsuario
             ?? (usuarioCajeroencontrado?.TipoUsuario != null
                 ? Convert.ToInt32(usuarioCajeroencontrado.TipoUsuario)
                 : (vMUsuarioConect?.TipoUsuario ?? vMPostulante?.TipoUsuario));


            claims.AddClaim(new Claim(ClaimTypes.Role, tipoUsuario.ToString()));

            int duracionTokenMinutos = 30;
            if (tipoUsuario == 2 || tipoUsuario == 1 || tipoUsuario == 4 || tipoUsuario == 7 || tipoUsuario == 8 || tipoUsuario == 5 || tipoUsuario == 9)
            {
                duracionTokenMinutos = 600;
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddMinutes(duracionTokenMinutos),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenConfig = tokenHandler.CreateToken(tokenDescriptor);
            string tokenCreado = tokenHandler.WriteToken(tokenConfig);
            DateTime fechaCreacion = DateTime.UtcNow;
            DateTime fechaExpiracion = fechaCreacion.AddMinutes(duracionTokenMinutos);

            if (usuarioEncontrado != null)
            {
                await _tokenService.GenerarActualizarTokenAsync(usuarioEncontrado.Id, usuarioEncontrado.Usuario1, tokenCreado, fechaCreacion, fechaExpiracion);
            }
            else if (usuarioCajeroencontrado != null) 
            {
                await _tokencajeroservice.GenerarActualizarTokenAsync((int)usuarioCajeroencontrado.Id, usuarioCajeroencontrado.Cuit, tokenCreado, fechaCreacion, fechaExpiracion);
            }
            else if(vMUsuarioConect != null)
            {
                await _tokenService.GenerarActualizarTokenAsync(vMUsuarioConect.IdUser, vMUsuarioConect.Usuario1, tokenCreado, fechaCreacion, fechaExpiracion);
            }
            else
            {
                await _tokenpostulanteService.GenerarActualizarTokenAsync(vMPostulante.Id,  tokenCreado, vMPostulante.Dni, fechaCreacion, fechaExpiracion);
            }

            var usuarioVM = usuarioEncontrado != null
     ? _mapper.Map<VMUsuariosZoco>(usuarioEncontrado)
     : usuarioCajeroencontrado != null
         ? _mapper.Map<VMUsuariosZoco>(usuarioCajeroencontrado)
         : vMPostulante != null
         ? _mapper.Map<VMUsuariosZoco>(vMPostulante)
         : _mapper.Map<VMUsuariosZoco>(vMUsuarioConect);


            var respuestaJson = new
            {
                usuario = usuarioVM,
                token = tokenCreado,
                rol = tipoUsuario
            };

            return Ok(respuestaJson);
        }

        [HttpPost("cambiarClave")]
        public async Task<IActionResult> CambiarClave([FromBody] VMCambioClave cambioClave)
        {
            bool esTokenValido = false;
            bool esTokenValidousuario = await _tokenService.ValidarTokenAsync(cambioClave.Token);
            if (esTokenValidousuario) {
                esTokenValido = true;
            }
            else
            {
                bool esTokenValidousuariocajero = await _tokencajeroservice.ValidarTokenAsync(cambioClave.Token);
                esTokenValido = esTokenValidousuariocajero;

            }
            if (esTokenValido)
            {
                if (cambioClave.ClaveNueva != cambioClave.ConfirmarClave)
                {
                    return BadRequest("Las contraseñas nuevas no coinciden.");
                }
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(cambioClave.Token);
                if (usuarioEncontrado.usuario != null)
                {
                    var resultado = await _usuariosService.CambiarClave(usuarioEncontrado.usuario.Id, cambioClave.ClaveActual, cambioClave.ClaveNueva);

                    if (resultado)
                    {
                        return Ok("Contraseña cambiada con éxito.");
                    }
                    else
                    {
                        return BadRequest("No se pudo cambiar la contraseña.");

                    }
                   
                }
                else
                {
                    var usuarioEncontradocajero = await _tokencajeroservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(cambioClave.Token);
                    if(usuarioEncontradocajero.usuario !=null)
                    {
                        var resultadocajero = await _usuariosCajeroService.CambiarClave(usuarioEncontradocajero.usuario.Id, cambioClave.ClaveActual, cambioClave.ClaveNueva);
                        if (resultadocajero)
                        {
                            return Ok("Contraseña cambiada con éxito.");

                        }
                        else
                        {
                            return BadRequest("No se pudo cambiar la contraseña.");

                        }
                    }
                    else
                    {
                        return BadRequest("No se pudo cambiar la contraseña.");

                    }


                }
            }
            else
            {
                return BadRequest("Token inválido.");
            }
        }
        [HttpPost("logout")]
        public async Task<ActionResult> Logout([FromBody] VMToken request)
        {
          
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                if (usuarioEncontrado.usuario != null)
                {
                    var resultado = await _tokenService.EliminarTokenAsync(usuarioEncontrado.usuario.Id);
                    if (resultado)
                    {
                        return Ok("Sesión cerrada correctamente.");
                    }
                    else
                    {
                        return BadRequest("Error al cerrar sesión.");
                    }
                }
                else
                {
                    return BadRequest("Usuario no encontrado.");
                }
            }

        }




    }
