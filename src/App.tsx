import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Mail, MapPin, Moon, Sun } from 'lucide-react';
import { ContactForm } from './components/ContactForm';
import { HeroEngineeringPlate, ProjectArtwork } from './components/ProjectArtwork';
import { ProjectModal } from './components/ProjectModal';
import {
  CERTIFICATIONS,
  PORTFOLIO_PROFILE,
  PROJECTS,
  SEMESTER_RECORDS,
  SKILLS,
  type ProjectItem,
} from './data/portfolio';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [inquirySubject, setInquirySubject] = useState<string>('');
  const [portraitError, setPortraitError] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    const saved = window.localStorage.getItem('portfolio-theme');
    if (saved === 'dark') {
      return true;
    }
    if (saved === 'light') {
      return false;
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      window.localStorage.setItem('portfolio-theme', 'dark');
    } else {
      root.classList.remove('dark');
      window.localStorage.setItem('portfolio-theme', 'light');
    }
  }, [isDark]);

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProjectInquiry = (projectTitle: string) => {
    setSelectedProject(null);
    setInquirySubject(`Question regarding ${projectTitle}`);
    scrollToSection('contact');
  };

  return (
    <div className="min-h-screen bg-[#F6F8F7] text-[#111E24] transition-colors duration-150 dark:bg-[#0C161B] dark:text-[#E8F0EE]">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 border-b border-[#D4DFDC] bg-[#F6F8F7]/95 backdrop-blur-md dark:border-[#1E333B] dark:bg-[#0C161B]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
          <a
            href="#top"
            className="font-display text-lg font-bold tracking-tight text-[#111E24] whitespace-nowrap shrink-0 dark:text-[#E8F0EE]"
          >
            {PORTFOLIO_PROFILE.shortName}
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-7 text-sm font-medium text-[#4D626A] md:flex dark:text-[#9BB2BA]"
          >
            <a
              href="#about"
              className="underline-offset-4 transition-colors hover:text-[#111E24] hover:underline whitespace-nowrap shrink-0 dark:hover:text-[#E8F0EE]"
            >
              About
            </a>
            <a
              href="#education"
              className="underline-offset-4 transition-colors hover:text-[#111E24] hover:underline whitespace-nowrap shrink-0 dark:hover:text-[#E8F0EE]"
            >
              Education
            </a>
            <a
              href="#projects"
              className="underline-offset-4 transition-colors hover:text-[#111E24] hover:underline whitespace-nowrap shrink-0 dark:hover:text-[#E8F0EE]"
            >
              Projects
            </a>
            <a
              href="#contact"
              className="underline-offset-4 transition-colors hover:text-[#111E24] hover:underline whitespace-nowrap shrink-0 dark:hover:text-[#E8F0EE]"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="rounded-lg bg-[#0B6B62] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#095951] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B6B62] whitespace-nowrap shrink-0 dark:bg-[#5FD0C3] dark:text-[#0C161B] dark:hover:bg-[#4EC0B3] dark:focus-visible:outline-[#5FD0C3]"
            >
              Send Query
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-6xl px-6">
        {/* Hero Split */}
        <section className="py-14 lg:py-20">
          <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col justify-between lg:col-span-7">
              <div>
                <p className="text-sm font-medium text-[#0B6B62] dark:text-[#5FD0C3]">
                  {PORTFOLIO_PROFILE.fullName} · {PORTFOLIO_PROFILE.location}
                </p>
                <h1 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-tight text-[#111E24] [text-wrap:balance] sm:text-5xl lg:text-[3.35rem] lg:leading-[1.08] dark:text-[#E8F0EE]">
                  {PORTFOLIO_PROFILE.headline}
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#4D626A] dark:text-[#9BB2BA]">
                  {PORTFOLIO_PROFILE.subheadline}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => scrollToSection('contact')}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#0B6B62] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#095951] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B6B62] whitespace-nowrap shrink-0 dark:bg-[#5FD0C3] dark:text-[#0C161B] dark:hover:bg-[#4EC0B3] dark:focus-visible:outline-[#5FD0C3]"
                >
                  <span>Contact Me</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <a
                  href="#projects"
                  className="inline-flex min-h-[44px] items-center rounded-lg border border-[#C9D7D3] bg-white px-5 py-2.5 text-sm font-semibold text-[#111E24] transition-colors hover:bg-[#EAF1EF] whitespace-nowrap shrink-0 dark:border-[#243B43] dark:bg-[#112026] dark:text-[#E8F0EE] dark:hover:bg-[#172A31]"
                >
                  Explore Projects
                </a>
                <button
                  type="button"
                  onClick={() => setIsDark((prev) => !prev)}
                  aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#C9D7D3] px-3.5 py-2 text-sm font-medium text-[#4D626A] transition-colors hover:text-[#111E24] whitespace-nowrap shrink-0 dark:border-[#243B43] dark:text-[#9BB2BA] dark:hover:text-[#E8F0EE]"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span>{isDark ? 'Light' : 'Dark'}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <HeroEngineeringPlate />
            </div>
          </div>

          {/* Full-width 4-column profile strip below Hero Split */}
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[#D4DFDC] bg-[#D4DFDC] sm:grid-cols-2 lg:grid-cols-4 dark:border-[#243B43] dark:bg-[#243B43]">
            <div className="bg-white p-5 dark:bg-[#112026]">
              <p className="text-xs font-medium text-[#4D626A] dark:text-[#9BB2BA]">Institution</p>
              <p className="mt-1.5 text-base font-semibold text-[#111E24] dark:text-[#E8F0EE]">
                {PORTFOLIO_PROFILE.university}
              </p>
            </div>
            <div className="bg-white p-5 dark:bg-[#112026]">
              <p className="text-xs font-medium text-[#4D626A] dark:text-[#9BB2BA]">
                Specialization
              </p>
              <p className="mt-1.5 text-base font-semibold text-[#111E24] dark:text-[#E8F0EE]">
                CSE (AI &amp; ML)
              </p>
            </div>
            <div className="bg-white p-5 dark:bg-[#112026]">
              <p className="text-xs font-medium text-[#4D626A] dark:text-[#9BB2BA]">
                Latest Semester GPA
              </p>
              <p className="font-mono-tabular mt-1.5 text-base font-semibold text-[#0B6B62] dark:text-[#5FD0C3]">
                7.862 / 10.0
              </p>
            </div>
            <div className="bg-white p-5 dark:bg-[#112026]">
              <p className="text-xs font-medium text-[#4D626A] dark:text-[#9BB2BA]">
                Location
              </p>
              <p className="mt-1.5 text-base font-semibold text-[#111E24] dark:text-[#E8F0EE]">
                {PORTFOLIO_PROFILE.location}
              </p>
            </div>
          </div>
        </section>

        {/* About & Skills */}
        <section
          id="about"
          className="scroll-mt-20 border-t border-[#D4DFDC] py-16 dark:border-[#1E333B]"
        >
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <h2 className="text-2xl font-bold tracking-tight text-[#111E24] dark:text-[#E8F0EE]">
                About Me
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#384B52] dark:text-[#B9CBD0]">
                {PORTFOLIO_PROFILE.about}
              </p>
              <p className="mt-5 text-sm text-[#4D626A] dark:text-[#9BB2BA]">
                <span>{PORTFOLIO_PROFILE.university}</span>
                <span aria-hidden="true"> · </span>
                <span>{PORTFOLIO_PROFILE.degree}</span>
                <span aria-hidden="true"> · </span>
                <span>{PORTFOLIO_PROFILE.location}</span>
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-2xl border border-[#D4DFDC] bg-[#EAF1EF] lg:ml-auto lg:mr-0 dark:border-[#243B43] dark:bg-[#13242A]">
                {!portraitError ? (
                  <img
                    src="/assets/aistudio/WhatsApp_Image_2026-11-19_at_10.47.24_PM_160d15d1.jpeg"
                    alt={`Portrait of ${PORTFOLIO_PROFILE.fullName}`}
                    referrerPolicy="no-referrer"
                    onError={() => setPortraitError(true)}
                    className="aspect-[4/5] w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex aspect-[4/5] w-full flex-col items-center justify-center p-6 text-center">
                    <span className="font-display text-3xl font-bold text-[#0B6B62] dark:text-[#5FD0C3]">
                      DLG
                    </span>
                    <span className="mt-2 text-sm font-medium text-[#4D626A] dark:text-[#9BB2BA]">
                      {PORTFOLIO_PROFILE.fullName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-10 border-t border-[#D4DFDC] pt-12 lg:grid-cols-12 lg:gap-12 dark:border-[#1E333B]">
            <div className="lg:col-span-4">
              <h3 className="text-xl font-bold tracking-tight text-[#111E24] dark:text-[#E8F0EE]">
                Core Skills
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-[#4D626A] dark:text-[#9BB2BA]">
                Foundations across algorithms, server-side engineering, and user interface
                craft.
              </p>
            </div>

            <div className="divide-y divide-[#D4DFDC] border-y border-[#D4DFDC] lg:col-span-8 dark:divide-[#1E333B] dark:border-[#1E333B]">
              {SKILLS.map((skill) => (
                <div key={skill.index} className="grid gap-2 py-6 sm:grid-cols-12 sm:gap-6">
                  <div className="sm:col-span-5">
                    <h4 className="text-base font-semibold text-[#111E24] dark:text-[#E8F0EE]">
                      {skill.index}. {skill.title}
                    </h4>
                  </div>
                  <p className="text-[15px] leading-relaxed text-[#4D626A] sm:col-span-7 dark:text-[#9BB2BA]">
                    {skill.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education & Certifications */}
        <section
          id="education"
          className="scroll-mt-20 border-t border-[#D4DFDC] py-16 dark:border-[#1E333B]"
        >
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <h2 className="text-2xl font-bold tracking-tight text-[#111E24] dark:text-[#E8F0EE]">
                Education &amp; Certification
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#4D626A] dark:text-[#9BB2BA]">
                Consistent upward academic trajectory across core computer science and artificial
                intelligence coursework.
              </p>
            </div>

            <div className="space-y-8 lg:col-span-8">
              <div className="rounded-2xl border border-[#D4DFDC] bg-white p-6 sm:p-8 dark:border-[#243B43] dark:bg-[#112026]">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-[#111E24] dark:text-[#E8F0EE]">
                      {PORTFOLIO_PROFILE.university}
                    </h3>
                    <p className="mt-1 text-sm text-[#4D626A] dark:text-[#9BB2BA]">
                      {PORTFOLIO_PROFILE.degree} · {PORTFOLIO_PROFILE.year}
                    </p>
                  </div>
                  <span className="font-mono-tabular text-xs font-medium text-[#0B6B62] dark:text-[#5FD0C3]">
                    CGPA Scale: 10.0
                  </span>
                </div>

                <div
                  className="mt-7 space-y-5"
                  role="region"
                  aria-label="Semester GPA progression: Semester 1 is 7.05, Semester 2 is 7.862 out of 10"
                >
                  {SEMESTER_RECORDS.map((record) => (
                    <div key={record.semester} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-[#111E24] dark:text-[#E8F0EE]">
                          {record.semester}
                        </span>
                        <span className="font-mono-tabular font-semibold text-[#111E24] dark:text-[#E8F0EE]">
                          {record.gpa.toFixed(record.gpa === 7.05 ? 2 : 3)} / 10
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#EAF1EF] dark:bg-[#1A2F37]">
                        <div
                          className="h-full rounded-full bg-[#0B6B62] dark:bg-[#5FD0C3]"
                          style={{ width: `${record.percentageWidth}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {CERTIFICATIONS.map((cert) => (
                <div
                  key={cert.title}
                  className="rounded-2xl border border-[#D4DFDC] bg-white p-6 sm:p-7 dark:border-[#243B43] dark:bg-[#112026]"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-base font-bold text-[#111E24] dark:text-[#E8F0EE]">
                      {cert.title}
                    </h3>
                    <span className="font-mono-tabular text-xs text-[#4D626A] dark:text-[#9BB2BA]">
                      {cert.period}
                    </span>
                  </div>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-[#4D626A] dark:text-[#9BB2BA]">
                    {cert.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section
          id="projects"
          className="scroll-mt-20 border-t border-[#D4DFDC] py-16 dark:border-[#1E333B]"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#111E24] dark:text-[#E8F0EE]">
                Selected Projects
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] text-[#4D626A] dark:text-[#9BB2BA]">
                Practical web applications built across back-end database engineering and interactive
                front-end design.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {PROJECTS.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col justify-between rounded-2xl border border-[#D4DFDC] bg-white p-6 transition-colors hover:border-[#0B6B62]/50 dark:border-[#243B43] dark:bg-[#112026] dark:hover:border-[#5FD0C3]/50"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B6B62] dark:focus-visible:outline-[#5FD0C3]"
                  >
                    <ProjectArtwork variant={project.artworkVariant} />
                  </button>

                  <p className="mt-5 text-xs font-medium text-[#4D626A] dark:text-[#9BB2BA]">
                    {project.index} · {project.category}
                  </p>

                  <h3 className="mt-1.5 text-xl font-bold tracking-tight text-[#111E24] dark:text-[#E8F0EE]">
                    {project.title}
                  </h3>

                  <p className="mt-2.5 text-[15px] leading-relaxed text-[#384B52] dark:text-[#B9CBD0]">
                    {project.summary}
                  </p>

                  <p className="mt-3 text-sm text-[#4D626A] dark:text-[#9BB2BA]">
                    <span className="font-semibold text-[#111E24] dark:text-[#E8F0EE]">
                      My role:{' '}
                    </span>
                    {project.role}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E6EEEC] pt-4 dark:border-[#1E333B]">
                  <span className="text-xs text-[#4D626A] dark:text-[#9BB2BA]">
                    {project.stack.join(' · ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B6B62] transition-colors hover:underline whitespace-nowrap shrink-0 dark:text-[#5FD0C3]"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="scroll-mt-20 border-t border-[#D4DFDC] py-16 dark:border-[#1E333B]"
        >
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <h2 className="text-2xl font-bold tracking-tight text-[#111E24] dark:text-[#E8F0EE]">
                Send a Query
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#4D626A] dark:text-[#9BB2BA]">
                {PORTFOLIO_PROFILE.availability}. Fill out the four fields—your name, contact email
                address, subject, and message—to send your inquiry directly to my inbox.
              </p>

              <div className="mt-8 space-y-4 border-t border-[#D4DFDC] pt-6 text-sm dark:border-[#1E333B]">
                <div className="flex items-center gap-3 text-[#111E24] dark:text-[#E8F0EE]">
                  <Mail className="h-4 w-4 shrink-0 text-[#0B6B62] dark:text-[#5FD0C3]" />
                  <a
                    href={`mailto:${PORTFOLIO_PROFILE.email}`}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {PORTFOLIO_PROFILE.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-[#4D626A] dark:text-[#9BB2BA]">
                  <MapPin className="h-4 w-4 shrink-0 text-[#0B6B62] dark:text-[#5FD0C3]" />
                  <span>{PORTFOLIO_PROFILE.location}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <ContactForm prefilledSubject={inquirySubject} />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#D4DFDC] py-8 dark:border-[#1E333B]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 text-xs text-[#4D626A] dark:text-[#9BB2BA]">
          <p>
            © {new Date().getFullYear()} {PORTFOLIO_PROFILE.fullName}
          </p>
          <div className="flex items-center gap-6">
            <a
              href={`mailto:${PORTFOLIO_PROFILE.email}`}
              className="transition-colors hover:text-[#111E24] dark:hover:text-[#E8F0EE]"
            >
              {PORTFOLIO_PROFILE.email}
            </a>
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              className="transition-colors hover:text-[#111E24] dark:hover:text-[#E8F0EE]"
            >
              {isDark ? 'Light Theme' : 'Dark Theme'}
            </button>
          </div>
        </div>
      </footer>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInquire={handleProjectInquiry}
      />
    </div>
  );
}
