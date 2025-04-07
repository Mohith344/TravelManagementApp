package com.example.travelmanagementapp.DTO;

    import javax.validation.constraints.Email;
    import javax.validation.constraints.NotBlank;
    import javax.validation.constraints.NotNull;

    public class TravelAgencyDTO {
        private Long id;

        @NotBlank(message = "Name is mandatory")
        private String name;

        @NotBlank(message = "Contact info is mandatory")
        @Email(message = "Contact info should be a valid email")
        private String contactInfo;

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getContactInfo() {
            return contactInfo;
        }

        public void setContactInfo(String contactInfo) {
            this.contactInfo = contactInfo;
        }
    }