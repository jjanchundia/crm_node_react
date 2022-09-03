/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
// import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormLabel,
  CFormText,
} from '@coreui/react'
import { deleteUser, getUsers, saveUser } from '../../../api/userApi'
import queryClient from '../queryClient'
import { useMutation, useQuery } from 'react-query'
import axios from 'axios'

const Usuarios = () => {
  const [visible, setModal] = useState(false)
  const [visibleEditar, setVisibleEditar] = useState(false)
  const [usuario, setUsuario] = useState({
    idUsuario: '',
    usuario: '',
    clave:''
  });

  const {
    isLoading,
    isFetching,
    error,
    data: usuarioApi,
  } = useQuery('usuarios', getUsers,{
    refetchInterval:3000
  })

  const { mutate } = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('usuarios')
    },
  })

  const handleDelete = usuario => event => {
    event.stopPropagation()

    if (window.confirm('¿Está seguro que desea borrar este usuario?')) {
      mutate(usuario.idusuario)
    }
  }

  const editarUsuario = (item) => {
    setUsuario(item);
    setVisibleEditar(!visibleEditar)
  }

  const agregar = () => {
    setUsuario({
      // nutriologistId:localStorage.getItem("id"),
      idusuario:"",
      usuario:"",
      clave:""
    });
    setModal(!visible);
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setUsuario(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const Modificar = () => {
    useMutation(Actualizar());
  };

  const Actualizar = ()=>{
    fetch(`http://localhost:4000/users/${usuario.idusuario}`, {
      method: 'PUT',
      body: JSON.stringify(usuario), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
    alert("Usuario actualizado correctamente");
    setVisibleEditar(!visibleEditar);
  }

  const Grabar2 = ()=>{
    fetch("http://localhost:4000/users", {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(usuario),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
    alert("Usuario grabado correctamente");
    setModal(!visible);
  }

  const Grabar = () => {
    useMutation(Grabar2());
  };

  //Búsqueda de items en la tabla
  const search=()=> {
    var tableReg = document.getElementById('regTable');
        var searchText = document.getElementById('searchTerm').value.toLowerCase();
        for (var i = 1; i < tableReg.rows.length; i++) {
            var cellsOfRow = tableReg.rows[i].getElementsByClassName('td');
            var found = false;
            for (var j = 0; j < cellsOfRow.length && !found; j++) {
                var compareWith = cellsOfRow[j].innerHTML.toLowerCase();
                if (searchText.length == 0 || (compareWith.indexOf(searchText) > -1)) {
                    found = true;
                }
            }
            if (found) {
                tableReg.rows[i].style.display = '';
            } else {
                tableReg.rows[i].style.display = 'none';
            }
    }
  }

  return (
    <CRow>

          <div className='row'>
            <input id="searchTerm"
               type="text"
               autoComplete='off'
               className='form-control mb-2'
               placeholder='Ingrese su búsqueda...'
               onKeyUp={search} />
          </div>

      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Usuarios</strong>&nbsp;&nbsp;
            <CButton onClick={() => agregar()}>Agregar</CButton>
          </CCardHeader>
          <CCardBody>
            <p className="text-medium-emphasis small">
              Informacion de los usuario.
            </p>
            {/* <DocsExample href="components/table"> */}
              <CTable id='regTable'>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Usuario</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Clave</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Opciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                {
                  usuarioApi?.map(x => (
                  <CTableRow key={x.id}>
                    <CTableDataCell className='td' scope="row">{x.usuario}</CTableDataCell>
                    <CTableDataCell className='td'>{x.clave}</CTableDataCell>
                    <CTableDataCell className='td'>
                      {/* <CButton onClick={handleEdit(x)}>Editar</CButton> */}
                      <CButton onClick={() => editarUsuario(x)}>Editar</CButton>
                      <CButton className='success' onClick={handleDelete(x)}>Eliminar</CButton>
                    </CTableDataCell>
                  </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            {/* </DocsExample> */}
          </CCardBody>
        </CCard>
      </CCol>

      <CModal visible={visible} onClose={() => setModal(false)}>
        <CModalHeader onClose={() => setModal(false)}>
          <CModalTitle>Agregar Usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Usuario:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput name="usuario"
              type="text"
              value={usuario.usuario}
              onChange={handleChange} />
          </CCol>
        </CRow>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Clave:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput  type="text" name="clave" value={usuario.clave} onChange={handleChange} />
          </CCol>
        </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => setModal(false)}>
            Cancelar
          </CButton>
          <CButton color="success" onClick={() => Grabar()}>Grabar</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={visibleEditar} onClose={() => setVisibleEditar(false)}>
        <CModalHeader onClose={() => setVisibleEditar(false)}>
          <CModalTitle>Editar Usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Usuario:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput type="text" name="idusuario" value={usuario.idusuario} hidden />
            <CFormInput type="text" name="usuario" value={usuario.usuario} onChange={handleChange} />
          </CCol>
        </CRow>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Clave:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput type="text" name="clave" value={usuario.clave} onChange={handleChange} />
          </CCol>
        </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => setVisibleEditar(false)}>
            Cancelar
          </CButton>
          <CButton color="success" onClick={() => Modificar()}>Grabar</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default Usuarios
