import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserStore } from '@/stores/user/user.store'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function UsersListComponent() {
  const users = useUserStore((store) => store.users)
  if (users.length > 0) {
    return (
      <>
        <Card className="max-w-[420px] min-w-[360px] sm:max-w-[700px] sm:min-w-[450px] sm:p-3 font-poppins border-2 border-cyan-200 hover:shadow-md hover:shadow-cyan-700">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-md sm:text-xl w-full">
              Below there is a list of all the registered users on the
              application.
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col text-xs">
            <Table className="items-center text-center">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">User</TableHead>
                  <TableHead className="text-center">E-mail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </>
    )
  }
}
