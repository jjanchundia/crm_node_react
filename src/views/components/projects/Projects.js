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
import { deleteProyecto, getProyectos } from '../../../api/proyectoApi'
import queryClient from '../queryClient'
import { useMutation, useQuery } from 'react-query'

const Proyectos = () => {
  const [visible, setModal] = useState(false)
  const [visibleEditar, setVisibleEditar] = useState(false)
  const [proyecto, setProyecto] = useState({
    idproyecto: '',
    nombres: '',
    descripcion:''
  });

  const {
    isLoading,
    isFetching,
    error,
    data: proyectoApi,
  } = useQuery('proyectos', getProyectos)

  const agregar = () => {
    setProyecto({
      idproyecto: '',
      nombres: '',
      descripcion:''
    });
    setModal(!visible);
  }

  const { mutate } = useMutation(deleteProyecto, {
    onSuccess: () => {
      queryClient.invalidateQueries('proyectos')
    },
  })

  const handleDelete = proyecto => event => {
    event.stopPropagation()

    if (window.confirm('¿Está seguro que desea borrar este proyecto?')) {
      mutate(proyecto.idproyecto)
    }
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setProyecto(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const Modificar = () => {
    useMutation(Actualizar());
  };

  const editarProyecto = (item) => {
    setProyecto(item);
    setVisibleEditar(!visibleEditar)
  }

  const Actualizar = ()=>{
    fetch(`http://localhost:4000/proyectos/${proyecto.idproyecto}`, {
      method: 'PUT',
      body: JSON.stringify(proyecto), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
    alert("Proyecto actualizado correctamente");
    setVisibleEditar(!visibleEditar);
  }

  const Grabar2 = ()=>{
    fetch("http://localhost:4000/proyectos", {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(proyecto),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
    alert("Proyecto grabado correctamente");
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
            <strong>Proyectos</strong>&nbsp;&nbsp;
            <CButton onClick={() => agregar()}>Agregar</CButton>
          </CCardHeader>
          <CCardBody>
            <p className="text-medium-emphasis small">
              Informacion de los proyectos.
            </p>
            {/* <DocsExample href="components/table"> */}
              <CTable id='regTable'>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">nombres</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Descripción</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Opciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                {
                  proyectoApi?.map(x => (
                  <CTableRow key={x.id}>
                    <CTableDataCell className='td' scope="row">{x.nombres}</CTableDataCell>
                    <CTableDataCell className='td'>{x.descripcion}</CTableDataCell>
                    <CTableDataCell className='td'>
                    <CButton onClick={() => editarProyecto(x)}>Editar</CButton>
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
          <CModalTitle>Agregar Proyecto</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Nombre:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput name="nombres"
              type="text"
              value={proyecto.nombres}
              onChange={handleChange} />
          </CCol>
        </CRow>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Descripcion:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput  type="text" name="descripcion" value={proyecto.descripcion} onChange={handleChange} />
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
          <CModalTitle>Editar Proyecto</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Nombre:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput type="text" name="idproyecto" value={proyecto.idproyecto} hidden />
            <CFormInput type="text" name="nombres" value={proyecto.nombres} onChange={handleChange} />
          </CCol>
        </CRow>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Descripción:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput type="text" name="descripcion" value={proyecto.descripcion} onChange={handleChange} />
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

export default Proyectos
