import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DropdownMenuBasic() {
   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="outline">Mở</Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent>
            <DropdownMenuGroup>
               <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
               <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
               <DropdownMenuItem>Thanh toán</DropdownMenuItem>
               <DropdownMenuItem>Cài đặt</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>GitHub</DropdownMenuItem>
            <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
            <DropdownMenuItem disabled>API</DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
