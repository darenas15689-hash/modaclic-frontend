function AdminGeneral() {
  return (
    <div>
      <h2 className="mb-3">Panel Administrador General</h2>

      <div className="row g-3">
        <div className="col-md-3">
          <div className="card p-3">
            <h6>Talleres</h6>
            <p className="fs-4">8</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3">
            <h6>Usuarios</h6>
            <p className="fs-4">24</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3">
            <h6>Pedidos</h6>
            <p className="fs-4">120</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminGeneral
