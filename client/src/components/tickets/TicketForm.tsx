import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";
import { Ticket, TicketPriority } from "../../types/ticket.types";

interface TicketFormProps {
    initialData?: Partial<Ticket>;
    onSubmit: (ticket: Omit<Ticket, "id" | "createdAt">) => void;
    onCancel?: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        priority: (initialData?.priority || "medium") as TicketPriority,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: SelectChangeEvent<TicketPriority>) => {
        setFormData((prev) => ({
            ...prev,
            priority: e.target.value as TicketPriority,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            status: "open",
            service: initialData?.service || { id: 0, name: "" },
            clientId: initialData?.clientId || 0,
            serviceType: "",
            createdBy: false,
            serviceId: undefined,
            emailSent: undefined
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />

            <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
                required
            />

            <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleSelectChange}
                    label="Priority"
                    required
                >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                </Select>
            </FormControl>

            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                {onCancel && (
                    <Button variant="outlined" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" variant="contained" color="primary">
                    {initialData?.id ? "Update Ticket" : "Create Ticket"}
                </Button>
            </Box>
        </Box>
    );
};

export default TicketForm;
