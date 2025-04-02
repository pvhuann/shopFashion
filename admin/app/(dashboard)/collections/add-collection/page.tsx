import CollectionForm from "@/components/collections/CollectionForm"

export const metadata = ()=> {
    return {
        title: "Create Collection | Admin Dashboard",
        description: "Create a new collection",
    }
}

const CreateCollection = () => {
    return (
        <CollectionForm/>
    )
}

export default CreateCollection