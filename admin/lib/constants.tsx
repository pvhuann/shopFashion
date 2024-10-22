import {
    LayoutDashboard,
    Shapes,
    ShoppingBag,
    Tag,
    UsersRound,
} from "lucide-react";

export const navLinks = [
    {
        url: "/",
        icon: <LayoutDashboard />,
        label: "Dashboard",
        navChild:["Default", "Alternative"],
    },
    {
        url: "/collections",
        icon: <Shapes />,
        label: "Collections",
        navChild:["Collections","Add Collection", "Collection Details"],

    },
    {
        url: "/products",
        icon: <Tag />,
        label: "Products",
        navChild:["Products","Add Product", "Product Details"],

    },
    {
        url: "/orders",
        icon: <ShoppingBag />,
        label: "Orders",
        navChild:["Orders", "Order Details"],

    },
    {
        url: "/customers",
        icon: <UsersRound />,
        label: "Customers",
        navChild:["Customers","Add Customer",  "Customer Details"],

    },





    
    // {
    //     url: "/",
    //     icon: <LayoutDashboard />,
    //     label: "Dashboard",
    //     navChild:["Default", "Alternative"],
    // },
    // {
    //     url: "/collections",
    //     icon: <Shapes />,
    //     label: "Collections",
    //     navChild:["Collection List","Add Collection", "Collection Details"],

    // },
    // {
    //     url: "/products",
    //     icon: <Tag />,
    //     label: "Products",
    //     navChild:["Product List","Add Product", "Product Details"],

    // },
    // {
    //     url: "/orders",
    //     icon: <ShoppingBag />,
    //     label: "Orders",
    //     navChild:["Order List", "Order Details"],

    // },
    // {
    //     url: "/customers",
    //     icon: <UsersRound />,
    //     label: "Customers",
    //     navChild:["Customer List","Add Customer",  "Customer Details"],

    // },

    // {
    //     url: "/",
    //     icon: <LayoutDashboard />,
    //     label: "Dashboard",
    //     navChild:["Default", "Alternative"],
    // },
    // {
    //     url: "/collections",
    //     icon: <Shapes />,
    //     label: "Collections",
    //     navChild:["Collection List","Add Collection", "Collection Details"],

    // },
    // {
    //     url: "/products",
    //     icon: <Tag />,
    //     label: "Products",
    //     navChild:["Product List","Add Product", "Product Details"],

    // },
    // {
    //     url: "/orders",
    //     icon: <ShoppingBag />,
    //     label: "Orders",
    //     navChild:["Order List", "Order Details"],

    // },
    // {
    //     url: "/customers",
    //     icon: <UsersRound />,
    //     label: "Customers",
    //     navChild:["Customer List","Add Customer",  "Customer Details"],

    // },

];