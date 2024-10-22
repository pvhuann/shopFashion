import {
    FileBadge,
    House,
    LayoutDashboard,
    Rows3,
    Shapes,
    ShoppingBag,
    Tag,
    UsersRound,
} from "lucide-react";

export const navLinks = [
    {
        icon: <House />,
        label: "Dashboard",
        navChild: [
            {
                name: "Default",
                url: "/",
            },
            {
                name: "Alternative",
                url: "/alternative",
            },
        ],
    },
    {
        icon: <FileBadge />,
        label: "Vendors",
        navChild: [{
            name: "Vendors",
            url: "/vendors"
        },
        {
            name: "Add vendor",
            url: "/vendors/add-vendor"
        },
        {
            name: "Vendor details",
            url: "/vendors/vendor-details"
        }],
    },
    {
        url: "/",
        icon: <Rows3 />,
        label: "Categories",
        navChild: [
            {
                name: "Categories",
                url: "/categories"
            },
            {
                name: "Add category",
                url: "/categories/add-category"
            },
            {
                name: "Category details",
                url: "/categories/category-details"
            },
        ]
    },
    {
        icon: <Shapes />,
        label: "Collections",
        navChild: [
            {
                name: "Collections",
                url: "/collections"
            },
            {
                name: "Add collection",
                url: "/collections/add-collection"
            },
            {
                name: "Collection details",
                url: "/collections/collection-details"
            },
        ],

    },
    {

        icon: <Tag />,
        label: "Products",
        navChild: [
            {
                name: "Products",
                url: "/products"
            },
            {
                name: "Add product",
                url: "/products/add-product"
            },
            {
                name: "Product details",
                url: "/products/product-details"
            },
        ],

    },
    {

        icon: <ShoppingBag />,
        label: "Orders",
        navChild: [
            {
                name: "Orders",
                url: "/orders"
            },
            {
                name: "Order details",
                url: "/orders/order-details"
            },
        ],

    },
    {

        icon: <UsersRound />,
        label: "Customers",
        navChild: [
            {
                name: "Customers",
                url: "/customers"
            },
            {
                name: "Add customer",
                url: "/customers/add-customer"
            },
            {
                name: "Customer details",
                url: "/customers/customer-details"
            },
        ],

    },


    {
        icon: <House />,
        label: "Dashboard",
        navChild: [
            {
                name: "Default",
                url: "/",
            },
            {
                name: "Alternative",
                url: "/alternative",
            },
        ],
    },
    {
        icon: <FileBadge />,
        label: "Vendors",
        navChild: [{
            name: "Vendors",
            url: "/vendors"
        },
        {
            name: "Add vendor",
            url: "/vendors/add-vendor"
        },
        {
            name: "Vendor details",
            url: "/vendors/vendor-details"
        }],
    },
    {
        url: "/",
        icon: <Rows3 />,
        label: "Categories",
        navChild: [
            {
                name: "Categories",
                url: "/categories"
            },
            {
                name: "Add category",
                url: "/categories/add-category"
            },
            {
                name: "Category details",
                url: "/categories/category-details"
            },
        ]
    },
    {
        icon: <Shapes />,
        label: "Collections",
        navChild: [
            {
                name: "Collections",
                url: "/collections"
            },
            {
                name: "Add collection",
                url: "/collections/add-collection"
            },
            {
                name: "Collection details",
                url: "/collections/collection-details"
            },
        ],

    },
    {

        icon: <Tag />,
        label: "Products",
        navChild: [
            {
                name: "Products",
                url: "/products"
            },
            {
                name: "Add product",
                url: "/products/add-product"
            },
            {
                name: "Product details",
                url: "/products/product-details"
            },
        ],

    },
    {

        icon: <ShoppingBag />,
        label: "Orders",
        navChild: [
            {
                name: "Orders",
                url: "/orders"
            },
            {
                name: "Order details",
                url: "/orders/order-details"
            },
        ],

    },
    {

        icon: <UsersRound />,
        label: "Customers",
        navChild: [
            {
                name: "Customers",
                url: "/customers"
            },
            {
                name: "Add customer",
                url: "/customers/add-customer"
            },
            {
                name: "Customer details",
                url: "/customers/customer-details"
            },
        ],

    },





];