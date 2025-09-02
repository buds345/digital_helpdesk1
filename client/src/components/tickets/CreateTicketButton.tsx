import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createTicket as createTicketApi } from "../../api/ticket.api";
import { Service } from "../../types/service.types"; // define Service type
import axios from "axios";

interface TicketFormValues {
  title: string;
  description: string;
  serviceId: string;
  priority: "low" | "medium" | "high" | "critical";
}

const CreateTicket: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: TicketFormValues = {
    title: "",
    description: "",
    serviceId: "",
    priority: "medium",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required").max(100),
    description: Yup.string().required("Description is required").max(2000),
    serviceId: Yup.string().required("Service is required"),
    priority: Yup.string()
      .oneOf(["low", "medium", "high", "critical"])
      .required("Priority is required"),
  });

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get<{ data: Service[] }>(
          "http://localhost:3001/api/services"
        );
        setServices(response.data.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (values: TicketFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert serviceId from string to number
      await createTicketApi({
        ...values,
        serviceId: Number(values.serviceId),
      });
      navigate("/");
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loadingServices)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create New Ticket
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange }) => (
          <Form>
            <Field
              as={TextField}
              name="title"
              label="Title"
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <ErrorMessage name="title">
              {(msg) => <Typography color="error">{msg}</Typography>}
            </ErrorMessage>

            <Field
              as={TextField}
              name="description"
              label="Description"
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={4}
            />
            <ErrorMessage name="description">
              {(msg) => <Typography color="error">{msg}</Typography>}
            </ErrorMessage>

            <FormControl fullWidth margin="normal">
              <InputLabel>Service</InputLabel>
              <Select
                name="serviceId"
                value={values.serviceId}
                onChange={handleChange}
              >
                {services.map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.name}
                  </MenuItem>
                ))}
              </Select>
              <ErrorMessage name="serviceId">
                {(msg) => <Typography color="error">{msg}</Typography>}
              </ErrorMessage>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={values.priority}
                onChange={handleChange}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ mt: 2 }}
            >
              {isSubmitting ? "Submitting..." : "Create Ticket"}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateTicket;
