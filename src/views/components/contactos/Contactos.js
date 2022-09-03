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
  CFormSelect,
} from '@coreui/react'

import { deleteContacto, getContacto, getContactos } from '../../../api/contactoApi'
import { getCliente, getClientes } from '../../../api/clienteApi'
import queryClient from '../queryClient'
import { useMutation, useQuery } from 'react-query'

const Contactos = () => {
  const [visible, setModal] = useState(false)
  const [visibleEditar, setVisibleEditar] = useState(false)
  const [contacto, setContacto] = useState({
    idcontacto: '',
    nombrecontacto: '',
    numero:'',
    idcliente:''
  });

  const {
    isLoading,
    isFetching,
    error,
    data: contactoApi,
  } = useQuery('contactos', getContactos)

  const {
    data: clienteApi,
  } = useQuery('clientes', getClientes)

  console.log(clienteApi);
  const { mutate } = useMutation(deleteContacto, {
    onSuccess: () => {
      queryClient.invalidateQueries('contactos')
    },
  })

  const handleDelete = contacto => event => {
    event.stopPropagation()

    if (window.confirm('¿Está seguro que desea borrar este contacto?')) {
      mutate(contacto.idcontacto)
      // alert(contacto.idcontacto);
    }
  }

  const [cliente, setCliente] = useState({
    idcliente:'',
    nombre:'',
    numero:''
  });

  const agregar = () => {
    setContacto({
      // nutriologistId:localStorage.getItem("id"),
      idcontacto: '',
      nombrecontacto: '',
      idcliente:'',
      numero:''
    });
    setCliente({
      idcliente:'',
      nombre:''
    });
    setModal(!visible);
  }

  const handleChangeCliente = e => {
    const { name, value } = e.target;
    setContacto(prevState => ({
      ...prevState,
      [name]: value,
    }))
    setCliente(prevState => ({
      ...prevState,
      [name]: value,
    }));
    // alert(cliente.idcliente);
  }


  const handleChange = e => {
    const { name, value } = e.target;
    setContacto(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const Modificar = () => {
    useMutation(Actualizar());
  };

  const editarContacto = (item) => {
    setContacto(item);
    setVisibleEditar(!visibleEditar)
  }

  const Actualizar = ()=>{
    fetch(`http://localhost:4000/contactos/${contacto.idcontacto}`, {
      method: 'PUT',
      body: JSON.stringify(contacto), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
    alert("contacto actualizado correctamente");
    setVisibleEditar(!visibleEditar);
  }

  const Grabar2 = ()=>{
    // alert(contacto.nombrecontacto);
    // alert(contacto.idcliente);
    fetch("http://localhost:4000/contactos", {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(contacto),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
    alert("contacto grabado correctamente");
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
            <strong>Contactos</strong>&nbsp;&nbsp;
            <CButton onClick={() => agregar()}>Agregar</CButton>
          </CCardHeader>
          <CCardBody>
            <p className="text-medium-emphasis small">
              Informacion de los Contactos.
            </p>
            {/* <DocsExample href="components/table"> */}
              <CTable id='regTable'>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Cliente</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Número</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Opciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                {
                  contactoApi?.map(x => (
                  <CTableRow key={x.id}>
                    <CTableDataCell className='td' scope="row">{x.nombrecontacto}</CTableDataCell>
                    <CTableDataCell className='td'>{x.cliente}</CTableDataCell>
                    <CTableDataCell className='td'>{x.numero}</CTableDataCell>
                    <CTableDataCell className='td'>
                    <CButton onClick={() => editarContacto(x)}>Editar</CButton>
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
          <CModalTitle>Agregar contacto</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Nombre:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput name="nombrecontacto"
              type="text"
              value={contacto.nombrecontacto}
              onChange={handleChange} />
          </CCol>
        </CRow>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Número:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput type="text" name="numero" value={contacto.numero} onChange={handleChange} />
          </CCol>
        </CRow>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Cliente:</CFormLabel>
            </CCol>
          <CCol md="8">
            <CFormSelect custom name="idcliente" value={cliente.idcliente} id={cliente.nombres} onChange={handleChangeCliente}>
              <option value="">--Seleccione un cliente--</option>
              {
                clienteApi?.map(i => (
                  <option key={i.idcliente} value={i.idcliente}>{i.nombres}</option>
                ))
              }
            </CFormSelect>
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
          <CModalTitle>Editar contacto</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Nombre:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput type="text" name="idcontacto" value={contacto.idcontacto} hidden />
            <CFormInput type="text" name="nombrecontacto" value={contacto.nombrecontacto} onChange={handleChange} />
          </CCol>
        </CRow>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Número:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput type="text" name="numero" value={contacto.numero} onChange={handleChange} />
          </CCol>
        </CRow>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Cliente:</CFormLabel>
          </CCol>
          <CCol md="8">
          <CFormSelect custom name="idcliente" value={contacto.idcliente} onChange={handleChange}>
              <option value="">--Seleccione un cliente--</option>
              {
                clienteApi?.map(i => (
                  <option key={i.idcliente} value={i.idcliente}>{i.nombres}</option>
                ))
              }
            </CFormSelect>
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

export default Contactos
