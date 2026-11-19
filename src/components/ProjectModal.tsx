import React, { useEffect } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import type { ProjectItem } from '../data/portfolio';
import { ProjectArtwork } from './ProjectArtwork';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onInquire: (projectTitle: string) => void;
}

export function ProjectModal({ project, onClose, onInquire }: ProjectModalProps) {
  useEffect(() => {
    if (!project) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C161B]/65 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#D4DFDC] bg-[#F6F8F7] p-6 shadow-2xl sm:p-8 dark:border-[#243B43] dark:bg-[#112026]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#4D626A] dark:text-[#9BB2BA]">
              {project.index}. {project.category}
            </p>
            <h3
              id="project-modal-title"
              className="mt-1 text-2xl font-bold tracking-tight text-[#111E24] dark:text-[#E8F0EE]"
            >
              {project.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#D4DFDC] bg-white text-[#111E24] transition-colors hover:bg-[#EAF1EF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B6B62] dark:border-[#243B43] dark:bg-[#172A31] dark:text-[#E8F0EE] dark:hover:bg-[#1E353D] dark:focus-visible:outline-[#5FD0C3]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6">
          <ProjectArtwork variant={project.artworkVariant} />
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <h4 className="text-sm font-semibold text-[#111E24] dark:text-[#E8F0EE]">Overview</h4>
            <p className="mt-1.5 text-[15px] leading-relaxed text-[#384B52] dark:text-[#B9CBD0]">
              {project.summary}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#111E24] dark:text-[#E8F0EE]">My Role</h4>
            <p className="mt-1.5 text-[15px] leading-relaxed text-[#384B52] dark:text-[#B9CBD0]">
              {project.role}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#111E24] dark:text-[#E8F0EE]">
              Key Contributions
            </h4>
            <ul className="mt-2 space-y-2 text-[15px] leading-relaxed text-[#384B52] dark:text-[#B9CBD0]">
              {project.highlights.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span aria-hidden="true" className="text-[#0B6B62] dark:text-[#5FD0C3]">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[#D4DFDC] pt-4 dark:border-[#243B43]">
            <p className="text-xs text-[#4D626A] dark:text-[#9BB2BA]">
              {project.stack.join(' · ')}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-[#D4DFDC] pt-5 dark:border-[#243B43]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#D4DFDC] px-4 py-2 text-sm font-medium text-[#111E24] transition-colors hover:bg-[#EAF1EF] whitespace-nowrap shrink-0 dark:border-[#243B43] dark:text-[#E8F0EE] dark:hover:bg-[#172A31]"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onInquire(project.title)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0B6B62] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#095951] whitespace-nowrap shrink-0 dark:bg-[#5FD0C3] dark:text-[#0C161B] dark:hover:bg-[#4EC0B3]"
          >
            <span>Ask About This Project</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
