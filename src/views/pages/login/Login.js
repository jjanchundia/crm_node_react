import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { usuario } from '../../components/usuarios/Usuarios'
import axios from 'axios';
import { useNavigate } from "react-router-dom"

const Login = () => {
  let navigate  = useNavigate();
  const [usuario, setUsuario] = useState({
    "usuario": '',
    "clave":''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setUsuario(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const enviarDatos = async (event) => {    
    var ss=`http://localhost:4000/login/?${usuario.usuario}&${usuario.clave}`;
    try {
      const resultado = await axios.get(`http://localhost:4000/login/?usuario=${usuario.usuario}&clave=${usuario.clave}`);
      console.log(resultado.data.length);
      if (resultado.data.length > 0){
        alert("Bienvenido al sistema");
        navigate("/dashboard");
      }
      else{
        alert("Usuario o contraseña incorrecto!!!");        
      }
    } catch (error) {
      alert(error.response.data);
    }
  };
  // usuario.

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Iniciar Sesión</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Username" type="text"
                      name="usuario"
                      value={usuario.usuario}
                      onChange={handleChange} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        name="clave" value={usuario.clave} onChange={handleChange}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={() => enviarDatos()}>
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      {/* <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton> */}
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
