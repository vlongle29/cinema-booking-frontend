import * as React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import StarBorderIcon from "@mui/icons-material/StarBorder";


interface MyCustomRatingProps {
   label?: string;
   value?: number | null;
   defaultValue?: number;
   variant?: "controlled" | "uncontrolled" | "read-only" | "disabled" | "empty";
   size?: "small" | "medium" | "large";
   onChange?: (newValue: number | null) => void;
}

export default function MyCustomRating({
   label,
   value,
   defaultValue,
   variant = "controlled", // Mặc định nếu không truyền gì sẽ là Controlled
   size,
   onChange,
}: MyCustomRatingProps) {
   return (
      <Box sx={{ "& > legend": { mt: 2 } }}>
         {label && (
            <Typography
               component="legend"
               className="block text-sm font-medium text-gray-400 mb-2"
            >
               {label}
            </Typography>
         )}
         <Rating
            name={`custom-rating-${variant}`}
            // Cấu hình giá trị dựa theo variant
            value={
               variant === "empty"
                  ? null
                  : variant === "uncontrolled"
                    ? undefined
                    : value
            }
            defaultValue={variant === "uncontrolled" ? defaultValue : undefined}
            // Trạng thái khóa/mở
            readOnly={variant === "read-only"}
            disabled={variant === "disabled"}
            size={size}
            emptyIcon={
               <StarBorderIcon fontSize="inherit" sx={{ color: "lightgrey" }} />
            }
            // Xử lý sự kiện thay đổi số sao
            onChange={(event, newValue) => {
               if (variant === "controlled" && onChange) {
                  onChange(newValue);
               }
            }}
         />
      </Box>
   );
}
