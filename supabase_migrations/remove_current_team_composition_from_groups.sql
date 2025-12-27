/**
 * Remove current_team_composition column from groups table
 *
 * This migration removes the unnecessary current_team_composition column
 * that was previously used for team fit analysis during group creation.
 * Team selection is now handled at the applicant detail page level.
 *
 * Date: 2024-12-27
 * Related Refactoring: Team selection UX improvement
 */

-- Remove the current_team_composition column from groups table
ALTER TABLE groups
DROP COLUMN IF EXISTS current_team_composition;

-- Add comment documenting the change
COMMENT ON TABLE groups IS
  'Recruitment groups table. Team composition analysis is now handled at applicant detail level via team selection dropdown.';
