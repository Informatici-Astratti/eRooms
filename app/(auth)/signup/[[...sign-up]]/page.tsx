
import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
    

    return (

        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <SignUp />
        </div>
    )
}