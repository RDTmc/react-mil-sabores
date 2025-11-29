import { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboardPage() {
  const { isAuthenticated, isAdmin, user } = useAuth();

  // Protección de ruta: sólo ADMIN
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const firstName = useMemo(
    () => user?.fullName?.split(" ")[0] || "Admin",
    [user]
  );

  // Datos MOCK por ahora (luego los conectamos a endpoints reales)
  const mockUsers = [
    { id: "U-001", name: "Cliente Demo", email: "cliente@demo.cl", createdAt: "2025-11-22" },
    { id: "U-002", name: "Luis Fuentes", email: "testcliente1@demo.cl", createdAt: "2025-11-23" },
    { id: "U-003", name: "Cliente Local", email: "cliente2@demo.cl", createdAt: "2025-11-24" },
  ];

  const mockOrders = [
    {
      id: "ORD-001",
      date: "2025-11-24 12:25",
      user: "Luis Fuentes",
      total: 10000,
      status: "CREATED",
    },
    {
      id: "ORD-002",
      date: "2025-11-24 14:41",
      user: "Usuario Test",
      total: 1000,
      status: "CREATED",
    },
  ];

  const kpis = {
    totalUsers: mockUsers.length,
    totalOrders: mockOrders.length,
    totalRevenue: mockOrders.reduce((acc, o) => acc + o.total, 0),
  };

  return (
    <div className="container-fluid py-3">
      <div className="row">
        {/* Sidebar */}
        <aside className="col-12 col-md-3 col-lg-2 mb-3 mb-md-0">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Panel Admin</h5>
              <p className="text-muted small mb-3">
                Sesión iniciada como <strong>{firstName}</strong>.
              </p>
              <nav>
                <ul className="nav flex-column small">
                  <li className="nav-item mb-1">
                    <span className="nav-link active fw-semibold">
                      Usuarios
                    </span>
                  </li>
                  <li className="nav-item mb-1">
                    <span className="nav-link text-muted">
                      Órdenes
                      <span className="badge bg-secondary ms-2">Pronto</span>
                    </span>
                  </li>
                  <li className="nav-item mb-1">
                    <span className="nav-link text-muted">
                      Inventario
                      <span className="badge bg-secondary ms-2">Pronto</span>
                    </span>
                  </li>
                  <li className="nav-item mb-1">
                    <span className="nav-link text-muted">
                      Reportes
                      <span className="badge bg-secondary ms-2">Pronto</span>
                    </span>
                  </li>
                  <li className="nav-item mb-1">
                    <span className="nav-link text-muted">
                      Configuración
                      <span className="badge bg-secondary ms-2">Pronto</span>
                    </span>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="col-12 col-md-9 col-lg-10">
          {/* KPIs */}
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">Usuarios totales</p>
                  <h3 className="mb-0">{kpis.totalUsers}</h3>
                  <small className="text-muted">
                    Incluye clientes registrados en la tienda online.
                  </small>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">Órdenes registradas</p>
                  <h3 className="mb-0">{kpis.totalOrders}</h3>
                  <small className="text-muted">
                    Últimas órdenes sincronizadas desde ms-orders.
                  </small>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">Ventas totales (mock)</p>
                  <h3 className="mb-0">
                    ${kpis.totalRevenue.toLocaleString("es-CL")}
                  </h3>
                  <small className="text-muted">
                    Monto aproximado de las órdenes de ejemplo.
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Sección usuarios */}
          <section className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2 className="h5 mb-0">Usuarios recientes</h2>
              <span className="badge bg-light text-dark border">
                Vista descriptiva
              </span>
            </div>
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Creado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map((u) => (
                        <tr key={u.id}>
                          <td>{u.id}</td>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>{u.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-muted small mt-2 mb-0">
                  En el futuro, esta tabla se conectará a{" "}
                  <code>/api/admin/users</code> de ms-usuarios para ver el
                  listado real de clientes y administradores.
                </p>
              </div>
            </div>
          </section>

          {/* Sección órdenes */}
          <section>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2 className="h5 mb-0">Órdenes recientes (mock)</h2>
              <span className="badge bg-light text-dark border">
                Muestra de datos
              </span>
            </div>
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th className="text-end">Total</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrders.map((o) => (
                        <tr key={o.id}>
                          <td>{o.id}</td>
                          <td>{o.date}</td>
                          <td>{o.user}</td>
                          <td className="text-end">
                            ${o.total.toLocaleString("es-CL")}
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {mockOrders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center text-muted">
                            Sin órdenes de ejemplo.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="text-muted small mt-2 mb-0">
                  Más adelante, esta sección se conectará a endpoints admin de
                  ms-orders para ver ventas por rango de fechas, sucursal y
                  canal.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
