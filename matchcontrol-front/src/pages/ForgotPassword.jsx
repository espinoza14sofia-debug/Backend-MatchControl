import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();

    //   Estado para capturar el correo (vinculado a la columna 'Email' de tu SQL)
    const [email, setEmail] = useState('');

    const handleRecovery = async (e) => {
        e.preventDefault();
        
        // Aquí se enviará la petición al backend para buscar el correo en la tabla 'Usuario'
        console.log("Buscando cuenta con el correo:", email);
        
        if (email) {
            alert("Si el correo existe en nuestro sistema, recibirás las instrucciones.");
            navigate('/'); // Redirigir al login después de enviar
        } else {
            alert("Por favor, ingresa un correo válido.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4F1EE]">
            <div className="w-full max-w-sm px-8">

                {/* Encabezado - Diseño intacto */}
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        <div className="bg-[#7C2220] p-4 rounded-full">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F4F1EE" strokeWidth="1.5">
                                <rect x="3" y="11" width="18" height="11" rx="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-lg font-light text-[#5F2119] tracking-[0.3em] uppercase">
                        Recuperar Cuenta
                    </h2>

                    <div className="h-[1px] w-12 bg-[#7C2220] mx-auto mt-4 opacity-40"></div>
                </div>

                {/* Formulario con manejo de datos */}
                <form onSubmit={handleRecovery} className="space-y-3">

                    <input
                        type="email"
                        placeholder="Correo Electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-[#E8E4E1]/60 p-4 rounded-2xl outline-none text-sm text-[#5F2119] placeholder-[#A28C75] border-none"
                    />

                    {/* Botón con el estilo que definiste */}
                    <button 
                        type="submit"
                        className="w-full bg-[#5F2119] text-[#D7C1A8] py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs mt-6 hover:bg-[#7C2220] transition-colors"
                    >
                        Enviar Instrucciones
                    </button>

                </form>

                {/* Enlace de retorno */}
                <div className="mt-10 text-center">
                    <button 
                        onClick={() => navigate('/')}
                        className="text-[#A28C75] text-[10px] uppercase tracking-widest hover:text-[#5F2119] font-bold"
                    >
                        Volver a iniciar sesión
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ForgotPassword;