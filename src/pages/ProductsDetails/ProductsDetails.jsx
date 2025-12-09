import { useParams } from "react-router-dom";
import ProductsDetailsSection from "../../component/Container/ProductsDetailsSection/ProductsDetailsSection";
function ProductsDetails() {
    const { id } = useParams();
    return (
        <ProductsDetailsSection slug={id} />
    )
}

export default ProductsDetails