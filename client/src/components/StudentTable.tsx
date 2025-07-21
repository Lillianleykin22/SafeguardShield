import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Eye } from "lucide-react";

export default function StudentTable() {
  const [search, setSearch] = useState("");
  const [className, setClassName] = useState("");
  const [status, setStatus] = useState("");

  const { data: students, isLoading } = useQuery({
    queryKey: ["/api/students", { search, className, status }],
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (attendanceStatus: string) => {
    switch (attendanceStatus) {
      case 'present':
        return <Badge className="status-present">נוכח</Badge>;
      case 'absent':
        return <Badge className="status-absent">נעדר</Badge>;
      case 'late':
        return <Badge className="status-late">איחור</Badge>;
      default:
        return <Badge variant="secondary">לא נרשם</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-gray-700 text-sm font-medium">חיפוש תלמיד</Label>
              <Input
                type="text"
                placeholder="שם או מספר זהות"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-2 focus:border-primary"
              />
            </div>
            <div>
              <Label className="text-gray-700 text-sm font-medium">כיתה</Label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              >
                <option value="">כל הכיתות</option>
                <option value="ז'1">ז'1</option>
                <option value="ז'2">ז'2</option>
                <option value="ח'1">ח'1</option>
                <option value="ח'2">ח'2</option>
                <option value="ט'1">ט'1</option>
                <option value="ט'2">ט'2</option>
              </select>
            </div>
            <div>
              <Label className="text-gray-700 text-sm font-medium">סטטוס</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              >
                <option value="">כל הסטטוסים</option>
                <option value="present">נוכח</option>
                <option value="absent">נעדר</option>
                <option value="late">איחור</option>
              </select>
            </div>
            <div>
              <Label className="text-gray-700 text-sm font-medium">&nbsp;</Label>
              <Button className="w-full mt-2 bg-primary text-white hover:bg-primary/90">
                <Search className="ml-2 w-4 h-4" />
                חפש
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    תלמיד
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    כיתה
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    סטטוס
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    זמן הגעה
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    הורה
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(students as any)?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      לא נמצאו תלמידים
                    </td>
                  </tr>
                ) : (
                  (students as any)?.map((student: any) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-300">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={student.profileImageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop"}
                            alt="תמונת תלמיד"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{student.studentId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.className}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge('present')} {/* This would come from attendance data */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        08:15 {/* This would come from attendance data */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.parentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 ml-2">
                          <Edit className="w-4 h-4" />
                          עריכה
                        </Button>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                          <Eye className="w-4 h-4" />
                          פרטים
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {(students as any)?.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">
                מציג 1-{(students as any)?.length} מתוך {(students as any)?.length} תלמידים
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">הקודם</Button>
                <Button size="sm" className="bg-primary text-white">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">הבא</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
