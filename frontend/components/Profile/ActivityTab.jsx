import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ActivityTab() {
  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Последняя активность</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Информация об активности будет отображаться здесь</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}