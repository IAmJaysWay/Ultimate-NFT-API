import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";

function MenuItems() {
  const { pathname } = useLocation();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        justifyContent: "center",
      }}
      defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/tokens">
        <NavLink to="/tokens">🚀 Tokens</NavLink>
      </Menu.Item>
      <Menu.Item key="/owners">
        <NavLink to="/owners">👛 Owners</NavLink>
      </Menu.Item>
{/*       <Menu.Item key="price">
        <NavLink to="/price">💰Price</NavLink>
      </Menu.Item> */}
      <Menu.Item key="transfers">
        <NavLink to="/transfers">➡️ Transfers</NavLink>
      </Menu.Item>
    </Menu>
  );
}

export default MenuItems;
