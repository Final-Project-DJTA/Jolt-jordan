"use client";
import { set } from "date-fns";
import { ChangeEvent, useEffect, useState } from "react";

export default function CreateResume() {
  useEffect(() => {
    // setIsLoaded(true);

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            return;
          }
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json();
        console.log("Profile API response:", data);

        // Properly structure the user and profile data
        // Check if data is already properly structured
        if (data && data.profile) {
          // Data already has the expected structure
          const { personalInfo, education, experience, skills } = data.profile;
          console.log("Personal Info:", personalInfo);
          //   {
          //     "fullName": "jago2",
          //     "email": "jago@gmail.com",
          //     "phone": "081219668285",
          //     "location": "Bandung",
          //     "linkedin": "https://www.linkedin.com/in/andrea-suryatanaya-b81210264/",
          //     "website": "www.hck.com",
          //     "summary": "Time"
          // }
          console.log("Education:", education);
          //   [
          //     {
          //         "degree": "S1",
          //         "institution": " abc",
          //         "location": "Bandung",
          //         "startDate": "2025-02",
          //         "endDate": "2025-10",
          //         "description": "abc"
          //     }
          // ]
          setEducation(education);
          setExperience(experience);
          setSkills(skills);
          console.log("Experience:", experience);
          //   [{
          //     "title": "Software Eng",
          //     "company": "PT. abc",
          //     "location": "Bekasi",
          //     "startDate": "2025-06",
          //     "endDate": "2025-08",
          //     "description": "abc"
          // }]
          console.log("Skills:", skills);
          //   [
          //     "native", "node"
          // ]
          setFormData({
            name: personalInfo.fullName,
            position: data.profile.bio,
            summary: personalInfo.summary,
            location: personalInfo.location,
            email: personalInfo.email,
            phone: personalInfo.phone,
            linkedin: personalInfo.linkedin,
            github: personalInfo.github,
          });
        }
        // Handle case where profile might be embedded differently
      } finally {
        // setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "Andrea Suryatanaya",
    position: "Software Engineer",
    location: "Jakarta, Indonesia",
    email: "andreasemut@gmail.com",
    summary: "",
    phone: "+62 812-3456-7890",
    linkedin: "LinkedIn",
    github: "GitHub",
  });

  const [education, setEducation] = useState([
    {
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);

  const [experience, setExperience] = useState([
    {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);

  const [skills, setSkills] = useState([""]);

  const handleEditClick = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Updated Data:", formData);
    setIsSidebarOpen(false);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById("cv-section");
    if (!element) return;

    import("html2pdf.js").then((html2pdfModule) => {
      const html2pdf = html2pdfModule.default || html2pdfModule;

      // Add fallback for when name is undefined
      const fileName = formData?.name
        ? formData.name.replace(/\s+/g, "_")
        : "Resume";

      const opt = {
        margin: 0.3,
        filename: `${fileName}_Resume.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      html2pdf().set(opt).from(element).save();
    });
  };

  return (
    <>
      <div className="flex items-start justify-center min-h-screen bg-gray-100 p-8 gap-4 w-full">
        {/* CV Section */}
        <div
          id="cv-section"
          className="bg-white shadow-md rounded-lg p-8 flex-1 min-h-screen mb-2"
        >
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h1 className="text-3xl font-bold">Andrea Suryatanaya</h1>
            <h2 className="text-xl text-gray-600">Software Engineer</h2>
            <p className="text-sm text-gray-500 mt-2">
              Jakarta, Indonesia • andreasemut@gmail.com • +62 812-3456-7890
            </p>
            <p className="text-sm text-gray-500">
              <a
                href="https://www.linkedin.com/in/andrea-suryatanaya/"
                className="text-blue-500"
                target="_blank"
              >
                LinkedIn
              </a>{" "}
              •{" "}
              <a
                href="https://github.com/andreasemut"
                className="text-blue-500"
                target="_blank"
              >
                GitHub
              </a>
            </p>
          </div>
          {/* Summary */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <p className="text-sm text-gray-700">
              A passionate software engineer with experience in building
              fullstack web applications using modern technologies. Fast
              learner, problem-solver, and enthusiastic about clean code and UX.
            </p>
          </div>
          {/* Education */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold border-b mb-2">Education</h3>
            <div className="text-sm text-gray-700 mb-4">
              <div className="flex justify-between">
                <span>S1 Computer Science</span>
                <span>Feb 2025 - Oct 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Universitas ABC</span>
                <span>Bandung</span>
              </div>
              <p className="mt-2">
                Graduated with honors, focused on web development
              </p>
              <div className="flex justify-between">
                <span>S1 Computer Science</span>
                <span>Feb 2025 - Oct 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Universitas ABC</span>
                <span>Bandung</span>
              </div>
              <p className="mt-2">
                Graduated with honors, focused on web development
              </p>
              <div className="flex justify-between">
                <span>S1 Computer Science</span>
                <span>Feb 2025 - Oct 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Universitas ABC</span>
                <span>Bandung</span>
              </div>
              <p className="mt-2">
                Graduated with honors, focused on web development
              </p>
            </div>
          </div>
          {/* Experience */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold border-b mb-2">
              Work Experience
            </h3>
            <div className="text-sm text-gray-700 mb-4">
              <div className="flex justify-between">
                <span>Software Engineer - PT. ABC</span>
                <span>Jun 2025 - Aug 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Bekasi</span>
              </div>
              <p className="mt-1">
                Developed internal tools using React and Node.js. Improved
                performance and user experience.
              </p>
            </div>
            {/* ///// */}

            <div className="text-sm text-gray-700 mb-4">
              <div className="flex justify-between">
                <span>Software Engineer - PT. ABC</span>
                <span>Jun 2025 - Aug 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Bekasi</span>
              </div>
              <p className="mt-1">
                Developed internal tools using React and Node.js. Improved
                performance and user experience.
              </p>
            </div>
            {/* //// */}

            <div className="text-sm text-gray-700 mb-4">
              <div className="flex justify-between">
                <span>Software Engineer - PT. ABC</span>
                <span>Jun 2025 - Aug 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Bekasi</span>
              </div>
              <p className="mt-1">
                Developed internal tools using React and Node.js. Improved
                performance and user experience.
              </p>
            </div>
          </div>
          {/* Skills */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold border-b mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2 text-sm">
              {["JavaScript", "React", "Node.js", "Next.js", "TailwindCSS"].map(
                (skill) => (
                  <span
                    key={skill}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>
          {/* Project
        <div className="mt-6">
          <h3 className="text-lg font-semibold border-b mb-2">Project</h3>
          <div></div>
        </div> */}
        </div>

        {/* Bookmark Sidebar */}
        <div className="bg-white shadow-md rounded-lg p-6 w-3/12 min-h-screen">
          <h2 className="text-lg font-bold mb-2">Bookmarks</h2>
          <p className="text-sm text-gray-500">Saved resume templates...</p>
        </div>
      </div>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>
    </>
  );
}
