import { handleGetProfile } from "@/lib/actions/auth-acitons";
import { notFound } from "next/navigation";

export default async function Page() {
    const result= await handleGetProfile();

    if(!result.success){
     throw new Error(result.message || "Failed to fetch profile data");
    }

    if(!result.data){
       notFound();
    }
    
    return (
        <div>
            User Loaded Successfully
        </div>
    );
}
