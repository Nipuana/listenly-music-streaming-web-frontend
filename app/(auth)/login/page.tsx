import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
export default function Page() {
    return (
        <div>
            <Label htmlFor="username">Username</Label>
            <Button variant="outline">button</Button>
        </div>
    );
}