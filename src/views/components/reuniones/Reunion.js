/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
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
import { deleteReunion, getReuniones } from '../../../api/reunionApi'
import queryClient from '../queryClient'
import { useMutation, useQuery } from 'react-query'

const Reunion = () => {
  const [visible, setModal] = useState(false)
  const [visibleEditar, setVisibleEditar] = useState(false)
  const [reunion, setReunion] = useState({
    idreunion: '',
    nombre: '',
    descripcion:'',
    enlace:''
  });

  const {
    isLoading,
    isFetching,
    error,
    data: reunionApi,
  } = useQuery('reunions', getReuniones)

  const agregar = () => {
    setReunion({
      idreunion: '',
      nombre: '',
      descripcion:'',
      enlace:''
    });
    setModal(!visible);
  }

  const { mutate } = useMutation(deleteReunion, {
    onSuccess: () => {
      queryClient.invalidateQueries('reunions')
    },
  })

  const handleDelete = reunion => event => {
    event.stopPropagation()

    if (window.confirm('¿Está seguro que desea borrar este reunion?')) {
      mutate(reunion.idreunion)
    }
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setReunion(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const Modificar = () => {
    useMutation(Actualizar());
  };

  const editarReunion = (item) => {
    setReunion(item);
    setVisibleEditar(!visibleEditar)
  }

  const Actualizar = ()=>{
    fetch(`http://localhost:4000/reuniones/${reunion.idreunion}`, {
      method: 'PUT',
      body: JSON.stringify(reunion), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
    alert("Reunión actualizada correctamente");
    setVisibleEditar(!visibleEditar);
  }

  const Grabar2 = ()=>{
    fetch("http://localhost:4000/reuniones", {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(reunion),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
    alert("Reunión grabada correctamente");
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
            <strong>Reunion</strong>&nbsp;&nbsp;
            <CButton onClick={() => agregar()}>Agregar</CButton>
          </CCardHeader>
          <CCardBody>
            <p className="text-medium-emphasis small">
              Informacion de las reuniones.
            </p>
            {/* <DocsExample href="components/table"> */}
              <CTable id='regTable'>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Descripción</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Enlace</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Opciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                {
                  reunionApi?.map(x => (
                  <CTableRow key={x.id}>
                    <CTableDataCell className='td' scope="row">{x.nombre}</CTableDataCell>
                    <CTableDataCell className='td'>{x.descripcion}</CTableDataCell>
                    <CTableDataCell className='td'>{x.enlace}</CTableDataCell>
                    <CTableDataCell className='td'>
                      <CButton onClick={() => editarReunion(x)}>Editar</CButton>
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
          <CModalTitle>Agregar Reunión</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Nombre:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput name="nombre"
              type="text"
              value={reunion.nombre}
              onChange={handleChange} />
          </CCol>
        </CRow>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Descripcion:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput  type="text" name="descripcion" value={reunion.descripcion} onChange={handleChange} />
          </CCol>
        </CRow>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Enlace:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput  type="text" name="enlace" value={reunion.enlace} onChange={handleChange} />
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
          <CModalTitle>Editar Reunión</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Nombre:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput type="text" name="idreunion" value={reunion.idreunion} hidden />
            <CFormInput type="text" name="nombre" value={reunion.nombre} onChange={handleChange} />
          </CCol>
        </CRow>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Descripción:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput type="text" name="descripcion" value={reunion.descripcion} onChange={handleChange} />
          </CCol>
        </CRow>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Enlace:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput  type="text" name="enlace" value={reunion.enlace} onChange={handleChange} />
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

export default Reunion
