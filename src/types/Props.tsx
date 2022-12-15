export interface SelectedTabProps {
  selectedProjectId: string
  selectedTabId: string
  search: string | null
  sortBy: string
  sort: boolean
  setSort: React.Dispatch<React.SetStateAction<boolean>>
}
