import { useEffect, useState } from "react";
import axios from "axios";
let approvedList=[];
let rejectedList=[];
const ApproveItem=({images})=>{
    const exportDataToJSON = () => {
        const exportedData = images.map((image) => {
          return {
            id: image._id,
            imageUrl: `./${image.path.replace(/\\/g, '/')}`, 
            status: image.status ? "approved" : "Pending"
          };
        });
    
        const jsonData = JSON.stringify(exportedData, null, 2); // Convert data to JSON string with indentation
        console.log(jsonData); 
        const blob = new Blob([jsonData], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "exported_data.json"; // Set the filename for the downloaded file

    // Append the link to the body and click it programmatically
    document.body.appendChild(link);
    link.click();

    // Clean up by revoking the URL object
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
      };
    return <div>
             {images.map((image) => (
                    <div key={image._id} className="image-container">
                        <img src={require(`./${image.path.replace(/\\/g, '/')}`)} />
                        <p>Status:{image.status?"approved":"Pending"}</p>
                    </div>
                ))}
         <button onClick={exportDataToJSON}>Export to JSON</button>
    </div>
}
const RejectedItem=({images})=>{
    return <div>
             {images.map((image) => (
                    <div key={image._id} className="image-container">
                        <img src={require(`./${image.path.replace(/\\/g, '/')}`)} />
                        <p>Status:{image.status?"approved":"Pending"}</p>
                    </div>
                ))}
    </div>
}
function Component(){
    const [images,setimage]=useState([]);
    const [imageData, setImageData] = useState(null);

    useEffect(()=>{
        axios('http://localhost:5000/api/items')
        .then((response)=>{setimage(response.data)
            console.log(images)})
        .catch(error=>console.log(error));

    },[])
    function handleapprove({element}){
        approvedList.push(element);
    }
    function handlereject(element){
        rejectedList.push(element);
    }
    return <div>
        <h1>Submited Image</h1>
        <img src={require(`./uploads/${image}`)} />

        <Imaglist images={images} onapprove={handleapprove} onreject={handlereject}/>
    </div>
}
const Imaglist=({images,onapprove,onreject})=>{
    console.log("imagelist")
    return <div>

             {images.map((image) => (
                    <div key={image._id} className="image-container">
                        <img src={require(`./${image.path.replace(/\\/g, '/')}`)} />
                        <p>Status:{image.status?"approved":"Pending"}</p>
                <div>
                     <button onClick={()=>onapprove(image)}>Approve</button>
                    <button onClick={()=>onreject(image)}>Reject</button>
            </div>
                    </div>
                ))}
                <ApproveItem/>
                <RejectedItem/>
    </div>
}

export default Component;