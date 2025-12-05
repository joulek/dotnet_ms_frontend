import Sidebar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Sidebar />
      <div className="main-content">{children}</div>
    </>
  );
}
