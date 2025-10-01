import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FileStack, Plus, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';

const Evidence = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="animated-text-scan">EVIDENCE LOCKER</span>
          </h1>
          <p className="text-muted-foreground mt-1">Forensic evidence management system</p>
        </div>
        <Button className="bg-secure-yellow hover:bg-secure-yellow/90 text-black">
          <Plus className="mr-2 h-4 w-4" />
          Log Evidence
        </Button>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileStack className="mr-2 h-5 w-5 text-secure-yellow" />
            Forensic Repository
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileStack className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Evidence Management Module</h3>
            <p className="text-muted-foreground mb-4">Advanced forensic tracking system under development</p>
            <div className="flex justify-center space-x-2">
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Evidence
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter Results
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Evidence;